import { describe, expect, it } from 'vitest';

import { decodeStackConfig, encodeStackConfig, MAX_STACK_TOKEN_LENGTH } from '../src/stack-config.js';

describe('stack configuration tokens', () => {
  it('round-trips selected groups and item order', () => {
    const token = encodeStackConfig({
      v: 1,
      groups: [
        { id: 'web', items: ['react', 'typescript', 'css'] },
        { id: 'mobile', items: ['flutter', 'dart'] },
      ],
    });
    const decoded = decodeStackConfig(token, 'octocat');

    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect(decoded.config.groups).toEqual([
      { id: 'web', items: ['react', 'typescript', 'css'] },
      { id: 'mobile', items: ['flutter', 'dart'] },
    ]);
    expect(decoded.profile.username).toBe('octocat');
    expect(decoded.profile.groups[0]?.items.map((item) => item.name)).toEqual(['React', 'TypeScript', 'CSS']);
  });

  it('rejects malformed, empty, duplicate, unknown, and oversized configurations', () => {
    expect(decodeStackConfig('not-base64-json', 'octocat').ok).toBe(false);
    expect(() => encodeStackConfig({ v: 1, groups: [] })).toThrow('Invalid stack configuration');
    expect(() => encodeStackConfig({ v: 1, groups: [{ id: 'web', items: ['react', 'react'] }] })).toThrow();
    expect(() => encodeStackConfig({ v: 1, groups: [{ id: 'web', items: ['unknown'] }] })).toThrow();
    expect(decodeStackConfig('a'.repeat(MAX_STACK_TOKEN_LENGTH + 1), 'octocat').ok).toBe(false);
  });
});
