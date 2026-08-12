import type { VercelRequest, VercelResponse } from '@vercel/node';

import { techCatalog } from '../src/catalog.js';
import { simpleIconById } from '../src/simple-icons.js';
import { renderIconSvg } from '../src/render/icons.js';

const safeIconId = /^[a-z0-9-]+$/u;
const localIconIds = new Set(techCatalog.flatMap((group) => group.items.map((item) => item.id)));

export default function handler(request: VercelRequest, response: VercelResponse): void {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Cache-Control', 'public, max-age=86400');
  response.setHeader('Content-Security-Policy', "default-src 'none'");
  response.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  response.setHeader('Vercel-CDN-Cache-Control', 'max-age=604800, stale-while-revalidate=2592000');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).send('');
    return;
  }

  const requested = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;
  const id = requested ?? '';
  if (!safeIconId.test(id) || (!simpleIconById.has(id) && !localIconIds.has(id))) {
    response.status(404).send('');
    return;
  }

  try {
    response.status(200).send(renderIconSvg(id));
  } catch {
    response.status(404).send('');
  }
}
