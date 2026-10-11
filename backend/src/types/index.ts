export interface AnalysisResult {
  item: string;
  category: 'Waste' | 'Water' | 'Energy' | 'Transport' | 'Nature';
  confidence: number;
  recommendedAction: string;
  actionId: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  source: 'aws' | 'fallback';
  result: T;
  s3Url?: string;
  message?: string;
}
