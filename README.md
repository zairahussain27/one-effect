# ONE EFFECT

> **"What happens when one small environmental action becomes a collective action?"**

**ONE EFFECT** is an interactive environmental impact platform designed for the **Environmental Hacks** hackathon. It empowers users to photograph an everyday item or choose an eco-friendly habit, immediately see their image and individual contribution, and simulate the exponential compounding impact when thousands of people do the same.

---

## 🌍 The Problem

People consistently underestimate the significance of individual environmental actions. A single recycled plastic bottle or a 1-minute shorter shower feels negligible in isolation. Because people don't see immediate feedback or how their small habits scale, they become disengaged.

## 🌱 The Solution

**ONE EFFECT** bridges the gap between individual actions and collective transformation:

1. **Instant Image Preview**: Upload any photo (PET bottle, bike commute, tap, plant); the image is displayed instantly without waiting for network latency.
2. **AI Action Identification**: Analyzes uploaded photos using Amazon Bedrock (Claude 3 Vision) with automatic intelligent local fallbacks.
3. **Seamless Flow**: The identified item automatically feeds directly into the individual action impact summary.
4. **"What If Everyone?" Simulator**: A real-time reactive mathematical simulator with people sliders (1 to 10,000+), frequency selectors (Daily, Weekly, Monthly, Once), and duration options (1 month to 5 years).
5. **Living Nature Visualization**: SVG-powered organic landscape that visibly expands from a single seed into a thriving ecosystem as participation scales.
6. **Community Milestones**: Multi-stage progress tracking (Seed → Plant → Patch → Garden → Forest).

---

## 🏗 Architecture

```text
                            ONE EFFECT UI (React + Vite)
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
         Instant Local Preview                      API Gateway (HTTP POST /api/analyze)
          (URL.createObjectURL)                                  │
                                                                 ▼
                                                            AWS Lambda
                                                                 │
                                                  ┌──────────────┴──────────────┐
                                                  ▼                             ▼
                                              Amazon S3                   Amazon Bedrock
                                            (Photo Storage)              (Claude 3 Vision)
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default local offline mode:
```env
VITE_USE_AWS=false
VITE_DEMO_MODE=false
```

### 3. Run the Development Server
```bash
npm run dev
```

---

## ☁️ AWS Integration & Deployment

### Backend Serverless Architecture
- **Amazon S3**: Stores user uploaded images with unique timestamped keys (`uploads/{timestamp}-{randomId}.{ext}`).
- **AWS Lambda**: Node.js 20 runtime orchestrating S3 uploads and Bedrock invocations.
- **Amazon Bedrock**: Multimodal vision AI powered by Anthropic Claude 3 Haiku (`anthropic.claude-3-haiku-20240307-v1:0`).
- **Amazon API Gateway**: CORS-enabled HTTP endpoints (`/api/analyze` and `/api/health`).

### Deploying with AWS SAM
```bash
cd infrastructure
sam build
sam deploy --guided
```

After deployment, copy the API endpoint output into your `.env`:
```env
VITE_API_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com
VITE_USE_AWS=true
```

---

## 🛡️ Resilience & Fallback AI System

ONE EFFECT is built with zero-failure resilience:
- If AWS API Gateway is unavailable, times out (>4.5s), or lacks credentials, the client **seamlessly falls back to local intelligent classification**.
- The uploaded photo remains on screen at all times.
- The user is never blocked by a technical 500 error or broken UI state.

---

## 🧪 Demo Mode (`VITE_DEMO_MODE=true`)

For seamless, deterministic 3-minute hackathon video recording:
```env
VITE_DEMO_MODE=true
```
This guarantees rock-solid, zero-network mock timings and stable demo data.

---

## 📂 Project Structure

```text
one-effect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── OrganicImpactVisual.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── ActionGrid.tsx
│   │   ├── ActionCard.tsx
│   │   ├── ScanSection.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── AnalysisResult.tsx
│   │   ├── ImpactPreview.tsx
│   │   ├── WhatIfSimulator.tsx
│   │   ├── ImpactVisualization.tsx
│   │   ├── CommunityEffect.tsx
│   │   ├── FinalCTA.tsx
│   │   └── Background.tsx
│   ├── context/
│   │   └── ImpactContext.tsx # Central session state & local storage persistence
│   ├── data/
│   │   ├── actions.ts        # Action definitions
│   │   ├── impactFactors.ts  # Centralized prototype impact factors
│   │   └── mockResponses.ts  # Intelligent fallback matcher
│   ├── services/
│   │   ├── aiService.ts      # AI abstraction layer with fallback
│   │   └── api.ts            # Backend API client
│   ├── utils/
│   │   ├── calculator.ts     # Deterministic mathematical engine
│   │   └── formatNumber.ts   # Formatting helpers
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── backend/                  # Serverless AWS Lambda handlers & services
│   ├── src/
│   │   ├── handlers/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
│
├── infrastructure/           # AWS SAM CloudFormation template
│   ├── template.yaml
│   └── README.md
│
├── docs/                     # Technical and demo documentation
│   ├── architecture.md
│   ├── aws-setup.md
│   ├── impact-methodology.md
│   └── demo-script.md
│
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚖️ License & Hackathon Notes
- Developed for **Environmental Hacks**.
- Nature-inspired design tokens: Forest Green, Sage, Mint, Cream, Sunlight Yellow.
- All impact figures are illustrative prototype factors for demonstration purposes.
