# ONE EFFECT

ONE EFFECT helps people measure the environmental impact of everyday actions. Users can upload a photo, have Amazon Bedrock identify the item or action, and calculate the individual and collective impact.

## Architecture

- React and Vite frontend
- API Gateway HTTP API
- Node.js 20 AWS Lambda
- Amazon S3 for uploaded images
- Amazon Bedrock vision analysis

The browser sends the selected image as `multipart/form-data` to `POST /api/analyze`. The Lambda parses the upload, stores it in S3, invokes Bedrock, and returns the classification and S3 URL. There is no local demo classifier or fabricated AWS response.

## Requirements

- Node.js 20+
- AWS CLI configured with credentials
- AWS SAM CLI
- Amazon Bedrock model access for Claude 3 Haiku in the deployment region

## Frontend setup

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_URL` in `.env` to the API Gateway URL output by SAM. The frontend requires this value for health checks and image analysis.

## Deploy the backend

```bash
cd backend
npm install
npm run build
cd ../infrastructure
sam build
sam deploy --guided
```

The SAM output includes `ApiEndpoint`. Copy that value into the root `.env` as `VITE_API_URL`, then restart the Vite server.

The deployed Lambda requires these environment variables:

```env
AWS_REGION=us-east-1
S3_BUCKET_NAME=one-effect-uploads
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
ALLOWED_ORIGIN=*
```

For local backend tooling, copy `backend/.env.example` to `backend/.env`. AWS credentials should be provided through the AWS CLI profile or the runtime environment, never committed to the repository.

## Validation

```bash
npm run build
cd backend
npm run build
```

## Project structure

```text
src/                  React application and AWS API client
backend/src/          Lambda handlers and S3/Bedrock services
infrastructure/       AWS SAM template
backend/.env.example  Backend configuration reference
.env.example          Frontend configuration reference
docs/                 Architecture, AWS, and impact methodology notes
```
