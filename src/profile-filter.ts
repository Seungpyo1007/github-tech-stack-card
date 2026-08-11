import type { CardProfile } from './types.js';

export function filterProfile(profile: CardProfile, hidden: Set<string>): CardProfile {
  if (hidden.size === 0) return profile;

  return {
    ...profile,
    groups: profile.groups
      .filter((group) => !hidden.has(group.id))
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => !hidden.has(item.id)),
      }))
      .filter((group) => group.items.length > 0),
  };
}
