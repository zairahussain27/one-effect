import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Busboy from 'busboy';
import { uploadImageToS3 } from '../services/s3';
import { analyzeImageWithBedrock } from '../services/bedrock';
import type { ApiResponse, AnalysisResult } from '../types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Content-Type': 'application/json'
};

interface ParsedImage {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

async function parseImage(event: APIGatewayProxyEvent): Promise<ParsedImage> {
  if (!event.body) {
    throw new Error('An image upload is required');
  }

  const contentType = Object.entries(event.headers || {}).find(
    ([key]) => key.toLowerCase() === 'content-type'
  )?.[1] || '';
  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : Buffer.from(event.body);

  if (contentType.toLowerCase().startsWith('multipart/form-data')) {
    return new Promise((resolve, reject) => {
      const parser = Busboy({ headers: { 'content-type': contentType }, limits: { fileSize: 10 * 1024 * 1024 } });
      const chunks: Buffer[] = [];
      let filename = 'upload.jpg';
      let mimeType = 'image/jpeg';
      let fileFound = false;

      parser.on('file', (_fieldname, file, info) => {
        fileFound = true;
        filename = info.filename || filename;
        mimeType = info.mimeType || mimeType;
        file.on('data', (chunk: Buffer) => chunks.push(chunk));
        file.on('limit', () => reject(new Error('Image is larger than 10 MB')));
      });
      parser.on('error', reject);
      parser.on('finish', () => {
        if (!fileFound || chunks.length === 0) {
          reject(new Error('The multipart request did not include an image'));
          return;
        }
        resolve({ buffer: Buffer.concat(chunks), mimeType, filename });
      });

      parser.end(body);
    });
  }

  if (contentType.toLowerCase().includes('application/json')) {
    const payload = JSON.parse(body.toString('utf8')) as {
      image?: string;
      mimeType?: string;
      filename?: string;
    };
    if (!payload.image) throw new Error('The JSON request did not include an image');
    return {
      buffer: Buffer.from(payload.image.replace(/^data:image\/[^;]+;base64,/, ''), 'base64'),
      mimeType: payload.mimeType || 'image/jpeg',
      filename: payload.filename || 'upload.jpg'
    };
  }

  return {
    buffer: body,
    mimeType: contentType || 'image/jpeg',
    filename: 'upload.jpg'
  };
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const { buffer: imageBuffer, mimeType, filename } = await parseImage(event);
    if (imageBuffer.length === 0) throw new Error('The uploaded image is empty');

    const s3Res = await uploadImageToS3(imageBuffer, mimeType, filename);

    const analysis = await analyzeImageWithBedrock(imageBuffer, mimeType, filename);

    const response: ApiResponse<AnalysisResult> = {
      success: true,
      source: 'aws',
      result: analysis,
      s3Url: s3Res.s3Url
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Image analysis request failed:', error);
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Image analysis failed'
      })
    };
  }
};
