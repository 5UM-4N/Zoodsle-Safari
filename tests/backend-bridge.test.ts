import { describe, it, expect } from 'vitest';
import { DescribeResponse, HealthResponse } from '../src/types';

describe('Safari Backend Bridge Contracts', () => {
  it('parses DescribeResponse correctly from local FastAPI backend', () => {
    const rawPayload: DescribeResponse = {
      description: 'A family having a picnic in the park.',
      mode: 'concise',
      metadata: {
        format: 'JPEG',
        width: 800,
        height: 600,
        aspect_ratio: 1.33,
        megapixels: 0.48,
        size_bytes: 85000,
        filename: 'safari_feed_image.jpg',
      },
      model: 'qwen/qwen3-vl-4b',
      is_local: true,
      privacy_notice: 'Inference processed entirely on your local machine using LM Studio.',
      image_data_url: 'data:image/jpeg;base64,abcdef',
    };

    expect(rawPayload.is_local).toBe(true);
    expect(rawPayload.model).toBe('qwen/qwen3-vl-4b');
    expect(rawPayload.description).toContain('picnic');
  });

  it('validates HealthResponse schema', () => {
    const health: HealthResponse = {
      status: 'ok',
      connected: true,
      is_local: true,
      base_url: 'http://127.0.0.1:1234/v1',
      configured_model: 'qwen/qwen3-vl-4b',
      model_available: true,
      available_models: ['qwen/qwen3-vl-4b'],
      max_upload_mb: 10,
      error: null,
    };

    expect(health.status).toBe('ok');
    expect(health.connected).toBe(true);
    expect(health.model_available).toBe(true);
  });
});
