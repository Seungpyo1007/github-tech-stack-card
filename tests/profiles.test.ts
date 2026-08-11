import { describe, expect, it } from 'vitest';

import { filterProfile } from '../src/profile-filter.js';
import { getProfile, listProfiles } from '../src/profiles.js';

describe('profile registry', () => {
  it('looks up profiles without case sensitivity', () => {
    expect(getProfile('seungpyo1007')?.username).toBe('Seungpyo1007');
    expect(listProfiles()).toEqual(['Seungpyo1007']);
  });

  it('hides complete groups and individual technologies', () => {
    const profile = getProfile('Seungpyo1007');
    expect(profile).toBeDefined();

    const filtered = filterProfile(profile!, new Set(['tools', 'react']));
    expect(filtered.groups.some((group) => group.id === 'tools')).toBe(false);
    expect(filtered.groups.flatMap((group) => group.items).some((item) => item.id === 'react')).toBe(false);
  });
});
