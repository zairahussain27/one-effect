# ONE EFFECT - AWS Infrastructure

This directory contains the AWS SAM (Serverless Application Model) template to deploy the serverless backend.

## Architecture

- **AWS API Gateway (HTTP API)**: Routes incoming requests to Lambda functions.
- **AWS Lambda**: Node.js 20 runtime orchestrating S3 uploads and Bedrock invocations.
- **Amazon S3**: Secure object storage for user-submitted action photos (`uploads/{timestamp}-{randomId}.{ext}`).
- **Amazon Bedrock**: Multimodal vision analysis powered by Claude 3 Haiku (`anthropic.claude-3-haiku-20240307-v1:0`).

## Deployment Instructions

### Prerequisites
1. [AWS CLI](https://aws.amazon.com/cli/) configured with valid credentials (`aws configure`).
2. [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed.
3. Access to Claude 3 Haiku enabled in the Amazon Bedrock console in your chosen region (e.g., `us-east-1`).

### Build & Deploy
```bash
# Navigate to infrastructure directory
cd infrastructure

# Build SAM application
sam build

# Deploy with guided wizard
sam deploy --guided
```

Once deployment completes, copy the output `ApiEndpoint` and paste it into your frontend `.env`:
```env
VITE_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com
VITE_USE_AWS=true
```
