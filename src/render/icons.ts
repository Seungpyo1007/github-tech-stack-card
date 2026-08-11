import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface InlineIcon {
  fill?: string;
  inner: string;
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

  const source = readFileSync(join(process.cwd(), 'assets', 'icons', `${id}.svg`), 'utf8');
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const fill = source.match(/<svg[^>]*\sfill="([^"]+)"/)?.[1];
  const inner = source
    .match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1]
    ?.replace(/<title>[\s\S]*?<\/title>/g, '')
    .trim();

  if (!inner) {
    throw new Error(`Invalid icon asset: ${id}`);
  }

  const icon: InlineIcon = fill ? { fill, inner, viewBox } : { inner, viewBox };
  cache.set(id, icon);
  return icon;
}
