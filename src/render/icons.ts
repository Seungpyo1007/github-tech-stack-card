import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { simpleIconById } from '../simple-icons.js';
import simpleIconData from '../../assets/simple-icons-data.json' with { type: 'json' };

interface InlineIcon {
  fill?: string;
  inner: string;
  monochrome?: boolean;
  viewBox: string;
}

const cache = new Map<string, InlineIcon>();
const safeIconId = /^[a-z0-9-]+$/;
const bundledIconData = simpleIconData as Record<string, { inner: string; viewBox: string }>;

export function loadIcon(id: string): InlineIcon {
  if (!safeIconId.test(id)) {
    throw new Error(`Invalid icon id: ${id}`);
  }

  const cached = cache.get(id);
  if (cached) return cached;

  const localPath = join(process.cwd(), 'assets', 'icons', `${id}.svg`);
  const isLocal = existsSync(localPath);
  const bundled = bundledIconData[id];
  const source = isLocal ? readFileSync(localPath, 'utf8') : '';
  const viewBox = isLocal ? source.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24' : bundled?.viewBox ?? '0 0 24 24';
  const fill = isLocal ? source.match(/<svg[^>]*\sfill="([^"]+)"/)?.[1] : undefined;
  const inner = isLocal
    ? source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1]?.replace(/<title>[\s\S]*?<\/title>/g, '').trim()
    : bundled?.inner;

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
  const resolvedFill = icon.monochrome && icon.fill === '#000000' ? '#FFFFFF' : icon.fill;
  const fill = resolvedFill ? ` fill="${resolvedFill}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="${icon.viewBox}"${fill}>${icon.inner}</svg>`;
}
