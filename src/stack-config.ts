import { techCatalog } from './catalog.js';
import type { CardProfile, StackConfigV1, TechGroup } from './types.js';

export const MAX_STACK_TOKEN_LENGTH = 4096;

export type StackDecodeResult =
  | { ok: true; config: StackConfigV1; profile: CardProfile }
  | { ok: false; error: string };

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(normalized + padding);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function validateConfig(value: unknown): { config: StackConfigV1; groups: TechGroup[] } | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<StackConfigV1>;
  if (candidate.v !== 1 || !Array.isArray(candidate.groups) || candidate.groups.length === 0 || candidate.groups.length > techCatalog.length) return null;

  const catalogById = new Map(techCatalog.map((group) => [group.id, group]));
  const seenGroups = new Set<string>();
  const groups: TechGroup[] = [];
  const normalizedGroups: StackConfigV1['groups'] = [];

  for (const requestedGroup of candidate.groups) {
    if (!requestedGroup || typeof requestedGroup.id !== 'string' || !Array.isArray(requestedGroup.items)) return null;
    const catalogGroup = catalogById.get(requestedGroup.id);
    if (!catalogGroup || seenGroups.has(requestedGroup.id) || requestedGroup.items.length === 0 || requestedGroup.items.length > catalogGroup.items.length) return null;

    const catalogItems = new Map(catalogGroup.items.map((item) => [item.id, item]));
    const seenItems = new Set<string>();
    const items = [];
    const itemIds: string[] = [];
    for (const itemId of requestedGroup.items) {
      if (typeof itemId !== 'string' || seenItems.has(itemId)) return null;
      const item = catalogItems.get(itemId);
      if (!item) return null;
      seenItems.add(itemId);
      itemIds.push(itemId);
      items.push({ ...item });
    }

    seenGroups.add(requestedGroup.id);
    normalizedGroups.push({ id: requestedGroup.id, items: itemIds });
    groups.push({ id: catalogGroup.id, name: catalogGroup.name, items });
  }

  return { config: { v: 1, groups: normalizedGroups }, groups };
}

export function encodeStackConfig(config: StackConfigV1): string {
  const validated = validateConfig(config);
  if (!validated) throw new Error('Invalid stack configuration');
  return toBase64Url(JSON.stringify(validated.config));
}

export function decodeStackConfig(token: string, username: string): StackDecodeResult {
  if (!token || token.length > MAX_STACK_TOKEN_LENGTH) return { ok: false, error: 'Invalid stack configuration' };
  try {
    const validated = validateConfig(JSON.parse(fromBase64Url(token)));
    if (!validated) return { ok: false, error: 'Invalid stack configuration' };
    return {
      ok: true,
      config: validated.config,
      profile: { username, groups: validated.groups },
    };
  } catch {
    return { ok: false, error: 'Invalid stack configuration' };
  }
}
