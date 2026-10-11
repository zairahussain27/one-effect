export type AnalysisStage =
  | 'uploading'
  | 'analyzing'
  | 'identifying'
  | 'verifying'
  | 'calculating'
  | 'complete'
  | 'fallback'
  | 'error';

export interface StageConfig {
  stage: AnalysisStage;
  label: string;
  detail: string;
  awsText: string;
  progress: number;
}

export const ANALYSIS_STAGES: StageConfig[] = [
  {
    stage: 'uploading',
    label: 'Image received & validated',
    detail: 'Visual payload prepared for AI inspection',
    awsText: 'Preparing secure image buffer...',
    progress: 12
  },
  {
    stage: 'analyzing',
    label: 'AI is analyzing visual context',
    detail: 'Scanning shape, edges, and texture',
    awsText: 'Sending visual context to AWS API Gateway...',
    progress: 35
  },
  {
    stage: 'identifying',
    label: 'Identifying object & material composition',
    detail: 'Classifying material properties & category',
    awsText: 'Amazon Bedrock (Claude 3 Vision) processing image...',
    progress: 58
  },
  {
    stage: 'verifying',
    label: 'Verifying selected environmental action',
    detail: 'Matching photo against recovery & conservation rules',
    awsText: 'Validating action parameters against environmental model...',
    progress: 78
  },
  {
    stage: 'calculating',
    label: 'Calculating personal environmental impact',
    detail: 'Formulating carbon, resource, and diversion metrics',
    awsText: 'Calibrating impact factors & circular economy models...',
    progress: 92
  },
  {
    stage: 'complete',
    label: 'Analysis verified & complete',
    detail: 'Your contribution is verified and ready',
    awsText: '✓ AWS Bedrock inference complete',
    progress: 100
  }
];
