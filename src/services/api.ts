import type { ScanResult } from '../types';

const API_BASE_URL = ((import.meta.env.VITE_API_URL || import.meta.env.VITE_AWS_API_URL || '') as string).replace(/\/$/, '');
const TIMEOUT_MS = 4500;

export async function fetchHealth(): Promise<{ status: string; timestamp: string }> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_URL is not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function sendImageToBackend(file: File): Promise<ScanResult> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_URL is not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data || !data.result) {
      throw new Error('Invalid response structure from backend');
    }

    const r = data.result;
    return {
      label: r.item || r.label || 'Identified Item',
      item: r.item || r.label || 'Identified Item',
      material: r.material || 'Recycled Eco Resource',
      category: r.category || 'Waste',
      confidence: typeof r.confidence === 'number' ? (r.confidence <= 1 ? Math.round(r.confidence * 100) : Math.round(r.confidence)) : 92,
      recommendedAction: r.recommendedAction || 'Recycle',
      actionId: r.actionId || (r.category?.toLowerCase() === 'water' ? 'save-water' : r.category?.toLowerCase() === 'energy' ? 'save-energy' : r.category?.toLowerCase() === 'transport' ? 'low-carbon-trip' : r.category?.toLowerCase() === 'nature' ? 'protect-green-space' : 'recycle-bottle'),
      verified: true,
      source: 'aws',
      rawResponse: data
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
