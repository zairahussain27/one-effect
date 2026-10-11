import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';
import type { AnalysisResult } from '../types';

const region = process.env.AWS_REGION || 'us-east-1';
const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';

const bedrockClient = new BedrockRuntimeClient({ region });

export async function analyzeImageWithBedrock(
  imageBuffer: Buffer,
  mimeType: string,
  filename?: string
): Promise<AnalysisResult> {
  const base64Image = imageBuffer.toString('base64');

  const prompt = `You are the environmental classifier for ONE EFFECT, an environmental collective impact simulator.
Analyze this image and identify the primary everyday environmental item or action shown.

Categories must be one of: "Waste", "Water", "Energy", "Transport", "Nature".
actionId must be one of: "bottle", "water", "energy", "transport", "nature".

Respond ONLY with valid JSON in this exact structure:
{
  "item": "string (e.g. PET Bottle, Bicycle, Light Bulb, Running Tap, Potted Plant)",
  "category": "Waste" | "Water" | "Energy" | "Transport" | "Nature",
  "confidence": number (between 0.70 and 0.99),
  "recommendedAction": "string (short actionable imperative, e.g. Recycle in plastic bin)",
  "actionId": "bottle" | "water" | "energy" | "transport" | "nature"
}`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
              data: base64Image
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ]
  };

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload)
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  const contentText = responseBody.content?.[0]?.text || '';
  const jsonMatch = contentText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON object found in Bedrock response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as AnalysisResult;
  return {
    item: parsed.item || 'Identified Item',
    category: parsed.category || 'Waste',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
    recommendedAction: parsed.recommendedAction || 'Recycle',
    actionId: parsed.actionId || 'bottle'
  };
}
