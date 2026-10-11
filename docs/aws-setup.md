# AWS Setup & Configuration Guide — ONE EFFECT

This guide explains how to configure AWS services for ONE EFFECT.

---

## 1. Prerequisites

- An active **AWS Account**.
- **AWS CLI** v2 installed and configured (`aws configure`).
- **AWS SAM CLI** installed.

---

## 2. Amazon Bedrock Model Access

1. Open the **AWS Management Console** and navigate to **Amazon Bedrock**.
2. Make sure you are in a supported region (e.g. `us-east-1` or `us-west-2`).
3. In the left navigation bar, select **Model access**.
4. Request access to **Anthropic Claude 3 Haiku** (`anthropic.claude-3-haiku-20240307-v1:0`).
5. Access is typically granted automatically within a few minutes.

---

## 3. Deploying the Backend with SAM

From the project root:

```bash
cd infrastructure
sam build
sam deploy --guided
```

Provide the requested configuration values:
- **Stack Name**: `one-effect-backend`
- **AWS Region**: `us-east-1`
- **Confirm changes before deploy**: `y`
- **Allow SAM CLI IAM role creation**: `y`
- **Disable rollback**: `n`
- **Save arguments to configuration file**: `y`

---

## 4. Configuring Frontend Environment Variables

Create `.env` in the root folder with the outputs from SAM:

```env
# Point to your deployed API Gateway
VITE_API_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com

# Enable AWS Integration
VITE_USE_AWS=true

# Set to true for 100% deterministic offline demo recording
VITE_DEMO_MODE=false
```

---

## 5. Local Offline Development Mode

To test or run completely offline without AWS:
```env
VITE_USE_AWS=false
VITE_DEMO_MODE=false
```
In this mode, all image previews, fallback AI classifications, simulation engines, and visualizations run 100% locally in the browser with zero external network dependencies.
