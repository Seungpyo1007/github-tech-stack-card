import { cloneCatalog } from './catalog.js';
import type { CardProfile } from './types.js';

const seungpyoProfile: CardProfile = {
  username: 'Seungpyo1007',
  groups: cloneCatalog(),
};

const profiles = new Map<string, CardProfile>([
  [seungpyoProfile.username.toLowerCase(), seungpyoProfile],
]);

export function getProfile(username: string): CardProfile | undefined {
  return profiles.get(username.toLowerCase());
}

export function listProfiles(): string[] {
  return [...profiles.values()].map((profile) => profile.username);
}
