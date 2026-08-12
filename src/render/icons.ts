import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { simpleIconById } from '../simple-icons.js';

interface InlineIcon {
  fill?: string;
  inner: string;
  monochrome?: boolean;
  viewBox: string;
}

const cache = new Map<string, InlineIcon>();
const safeIconId = /^[a-z0-9-]+$/;

export function loadIcon(id: string): InlineIcon {
  if (!safeIconId.test(id)) {
    throw new Error(`Invalid icon id: ${id}`);
  }

  const cached = cache.get(id);
  if (cached) return cached;

  const localPath = join(process.cwd(), 'assets', 'icons', `${id}.svg`);
  const packagePath = join(process.cwd(), 'node_modules', 'simple-icons', 'icons', `${id}.svg`);
  const isLocal = existsSync(localPath);
  const source = readFileSync(isLocal ? localPath : packagePath, 'utf8');
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const fill = source.match(/<svg[^>]*\sfill="([^"]+)"/)?.[1];
  const inner = source
    .match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1]
    ?.replace(/<title>[\s\S]*?<\/title>/g, '')
    .trim();

  if (!inner) {
    throw new Error(`Invalid icon asset: ${id}`);
  }

  const simpleFill = simpleIconById.get(id)?.hex;
  const resolvedFill = fill ?? (!isLocal ? simpleFill : undefined);
  const icon: InlineIcon = resolvedFill
    ? { fill: resolvedFill, inner, monochrome: !isLocal, viewBox }
    : { inner, viewBox };
  cache.set(id, icon);
  return icon;
}

export function renderIconSvg(id: string): string {
  const icon = loadIcon(id);
  const fill = icon.fill ? ` fill="${icon.fill}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="${icon.viewBox}"${fill}>${icon.inner}</svg>`;
}
