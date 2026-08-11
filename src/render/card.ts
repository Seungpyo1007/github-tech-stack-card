import type { BaseRenderOptions, CardProfile, TechGroup } from '../types.js';
import { loadIcon } from './icons.js';

const CARD_WIDTH = 960;
const HORIZONTAL_PADDING = 18;
const LABEL_WIDTH = 192;

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    };
    return entities[character] ?? character;
  });
}

function renderIcon(id: string, name: string, x: number, y: number, size: number, tile: string, border: string): string {
  const icon = loadIcon(id);
  const padding = Math.max(8, Math.round(size * 0.28));
  const tileSize = size + padding * 2;
  const fillAttribute = icon.fill ? ` fill="${escapeXml(icon.fill)}"` : '';

  return `
    <g>
      <title>${escapeXml(name)}</title>
      <rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="12" fill="${tile}" stroke="${border}" stroke-opacity="0.28"/>
      <svg x="${x + padding}" y="${y + padding}" width="${size}" height="${size}" viewBox="${escapeXml(icon.viewBox)}" preserveAspectRatio="xMidYMid meet"${fillAttribute}>${icon.inner}</svg>
    </g>`;
}

function groupHeight(group: TechGroup, iconSize: number): number {
  const padding = Math.max(8, Math.round(iconSize * 0.28));
  const tileSize = iconSize + padding * 2;
  const cellWidth = tileSize + 15;
  const availableWidth = CARD_WIDTH - HORIZONTAL_PADDING * 2 - LABEL_WIDTH;
  const columns = Math.max(1, Math.floor(availableWidth / cellWidth));
  const lines = Math.max(1, Math.ceil(group.items.length / columns));
  return Math.max(82, lines * (tileSize + 12) + 20);
}

export function renderRowsCard(profile: CardProfile, options: BaseRenderOptions): string {
  const titleHeight = options.hideTitle ? 0 : 68;
  const heights = profile.groups.map((group) => groupHeight(group, options.iconSize));
  const height = 20 + titleHeight + heights.reduce((total, value) => total + value, 0);
  const parts: string[] = [];

  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" role="img" aria-labelledby="title desc">`);
  parts.push(`<title id="title">${escapeXml(options.title)}</title>`);
  parts.push(`<desc id="desc">Technology logos grouped by category for ${escapeXml(profile.username)}.</desc>`);
  parts.push(`<rect x="1" y="1" width="${CARD_WIDTH - 2}" height="${height - 2}" rx="16" fill="${options.theme.background}" stroke="${options.theme.border}" stroke-width="2"/>`);

  let top = 10;
  if (!options.hideTitle) {
    parts.push(`<text x="${CARD_WIDTH / 2}" y="43" text-anchor="middle" fill="${options.theme.text}" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(options.title)}</text>`);
    top += titleHeight;
  }

  profile.groups.forEach((group, groupIndex) => {
    const rowHeight = heights[groupIndex] ?? 82;
    const padding = Math.max(8, Math.round(options.iconSize * 0.28));
    const tileSize = options.iconSize + padding * 2;
    const cellWidth = tileSize + 15;
    const availableWidth = CARD_WIDTH - HORIZONTAL_PADDING * 2 - LABEL_WIDTH;
    const columns = Math.max(1, Math.floor(availableWidth / cellWidth));

    if (groupIndex > 0) {
      parts.push(`<line x1="18" y1="${top}" x2="942" y2="${top}" stroke="${options.theme.accent}" stroke-opacity="0.22"/>`);
    }

    parts.push(`<text x="24" y="${top + rowHeight / 2 + 6}" fill="${options.theme.accent}" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="600">${escapeXml(group.name)}</text>`);

    group.items.forEach((item, itemIndex) => {
      const column = itemIndex % columns;
      const line = Math.floor(itemIndex / columns);
      const x = HORIZONTAL_PADDING + LABEL_WIDTH + column * cellWidth;
      const y = top + 10 + line * (tileSize + 12);
      parts.push(renderIcon(item.id, item.name, x, y, options.iconSize, options.theme.tile, options.theme.border));
    });

    top += rowHeight;
  });

  parts.push('</svg>');
  return parts.join('\n');
}
