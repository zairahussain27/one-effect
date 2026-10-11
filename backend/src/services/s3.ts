import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = process.env.S3_BUCKET_NAME || 'one-effect-uploads';

const s3Client = new S3Client({ region });

export async function uploadImageToS3(
  fileBuffer: Buffer,
  mimeType: string,
  originalFilename = 'upload.jpg'
): Promise<{ key: string; s3Url: string }> {
  const extension = originalFilename.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 10);
  const key = `uploads/${timestamp}-${randomId}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    Metadata: {
      'original-filename': originalFilename,
      'upload-source': 'one-effect'
    }
  });

  await s3Client.send(command);

  const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  return { key, s3Url };
}
