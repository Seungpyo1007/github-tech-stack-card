import type { VercelRequest, VercelResponse } from '@vercel/node';
import { describe, expect, it } from 'vitest';

import handler from '../api/icon.js';

function invoke(query: VercelRequest['query'], method = 'GET') {
  const state = { body: '', headers: {} as Record<string, unknown>, statusCode: 200 };
  const response = {
    send(body: string) { state.body = body; return this; },
    setHeader(name: string, value: unknown) { state.headers[name] = value; return this; },
    status(code: number) { state.statusCode = code; return this; },
  } as unknown as VercelResponse;
  handler({ method, query } as VercelRequest, response);
  return state;
}

describe('icon API', () => {
  it('serves a bundled Simple Icon with long-lived caching', () => {
    const state = invoke({ id: 'astro' });
    expect(state.statusCode).toBe(200);
    expect(state.body).toContain('<svg');
    expect(state.headers['Content-Type']).toBe('image/svg+xml; charset=utf-8');
    expect(state.headers['Vercel-CDN-Cache-Control']).toContain('max-age=604800');
  });

  it('rejects unknown and unsafe icon ids', () => {
    expect(invoke({ id: 'not-a-real-icon' }).statusCode).toBe(404);
    expect(invoke({ id: '../astro' }).statusCode).toBe(404);
  });
});
