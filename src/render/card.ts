import type { BaseRenderOptions, CardProfile, RenderOptions, TechGroup } from '../types.js';
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

function renderAnimationStyles(enabled: boolean): string {
  if (!enabled) return '';
  return `<style>
    .card-title-motion, .group-label { opacity: 0; animation: fadeSlide 0.55s ease-out forwards; }
    .tech-icon-entry { opacity: 0; transform-box: fill-box; transform-origin: center; animation: iconIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .tech-icon-float { transform-box: fill-box; transform-origin: center; animation: iconFloat 3.8s ease-in-out infinite; }
    .separator-motion { stroke-dasharray: 1; stroke-dashoffset: 1; animation: separatorDraw 0.8s ease-out forwards; }
    .border-shimmer { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 10 90; animation: borderTravel 6s linear infinite; }
    @keyframes fadeSlide { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes iconIn { from { opacity: 0; transform: translateY(8px) scale(0.82); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes iconFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
    @keyframes separatorDraw { to { stroke-dashoffset: 0; } }
    @keyframes borderTravel { to { stroke-dashoffset: -100; } }
    @media (prefers-reduced-motion: reduce) {
      .card-title-motion, .group-label, .tech-icon-entry, .tech-icon-float, .separator-motion, .border-shimmer {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
        stroke-dashoffset: 0 !important;
      }
    }
  </style>`;
}

function renderBorderShimmer(enabled: boolean, width: number, height: number, color: string): string {
  if (!enabled) return '';
  return `<rect class="border-shimmer" x="2" y="2" width="${width - 4}" height="${height - 4}" rx="15" pathLength="100" stroke="${color}"/>`;
}

function labelMotion(enabled: boolean, delay: number): string {
  return enabled ? ` class="group-label" style="animation-delay:${delay}ms"` : '';
}

function separatorMotion(enabled: boolean, delay: number): string {
  return enabled ? ` class="separator-motion" pathLength="1" style="animation-delay:${delay}ms"` : '';
}

function iconMotion(enabled: boolean, index: number): { close: string; open: string } {
  if (!enabled) return { close: '</g>', open: '<g>' };
  const entryDelay = 180 + index * 45;
  const floatDelay = 1200 + (index % 7) * 180;
  return {
    close: '</g></g>',
    open: `<g class="tech-icon-entry" style="animation-delay:${entryDelay}ms"><g class="tech-icon-float" style="animation-delay:${floatDelay}ms">`,
  };
}

function renderIcon(id: string, name: string, x: number, y: number, size: number, tile: string, border: string, foreground: string, animated: boolean, motionIndex: number): string {
  const icon = loadIcon(id);
  const padding = Math.max(8, Math.round(size * 0.28));
  const tileSize = size + padding * 2;
  const fill = icon.monochrome && icon.fill === '#000000' ? foreground : icon.fill;
  const fillAttribute = fill ? ` fill="${escapeXml(fill)}"` : '';
  const motion = iconMotion(animated, motionIndex);

  return `
    ${motion.open}
      <title>${escapeXml(name)}</title>
      <rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="12" fill="${tile}" stroke="${border}" stroke-opacity="0.28"/>
      <svg x="${x + padding}" y="${y + padding}" width="${size}" height="${size}" viewBox="${escapeXml(icon.viewBox)}" preserveAspectRatio="xMidYMid meet"${fillAttribute}>${icon.inner}</svg>
    ${motion.close}`;
}

function renderBareIcon(id: string, name: string, x: number, y: number, size: number, foreground: string, animated: boolean, motionIndex: number): string {
  const icon = loadIcon(id);
  const fill = icon.monochrome && icon.fill === '#000000' ? foreground : icon.fill;
  const fillAttribute = fill ? ` fill="${escapeXml(fill)}"` : '';
  const motion = iconMotion(animated, motionIndex);
  return `
    ${motion.open}
      <title>${escapeXml(name)}</title>
      <svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${escapeXml(icon.viewBox)}" preserveAspectRatio="xMidYMid meet"${fillAttribute}>${icon.inner}</svg>
    ${motion.close}`;
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
  parts.push(renderAnimationStyles(options.animated));
  parts.push(`<rect x="1" y="1" width="${CARD_WIDTH - 2}" height="${height - 2}" rx="16" fill="${options.theme.background}" stroke="${options.theme.border}" stroke-width="2"/>`);
  parts.push(renderBorderShimmer(options.animated, CARD_WIDTH, height, options.theme.accent));

  let top = 10;
  if (!options.hideTitle) {
    parts.push(`<text${options.animated ? ' class="card-title-motion" style="animation-delay:80ms"' : ''} x="${CARD_WIDTH / 2}" y="43" text-anchor="middle" fill="${options.theme.text}" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(options.title)}</text>`);
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
      parts.push(`<line${separatorMotion(options.animated, 120 + groupIndex * 130)} x1="18" y1="${top}" x2="942" y2="${top}" stroke="${options.theme.accent}" stroke-opacity="0.22"/>`);
    }

    parts.push(`<text${labelMotion(options.animated, 110 + groupIndex * 130)} x="24" y="${top + rowHeight / 2 + 6}" fill="${options.theme.accent}" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="600">${escapeXml(group.name)}</text>`);

    group.items.forEach((item, itemIndex) => {
      const column = itemIndex % columns;
      const line = Math.floor(itemIndex / columns);
      const x = HORIZONTAL_PADDING + LABEL_WIDTH + column * cellWidth;
      const y = top + 10 + line * (tileSize + 12);
      parts.push(renderIcon(item.id, item.name, x, y, options.iconSize, options.theme.tile, options.theme.border, options.theme.text, options.animated, groupIndex * 16 + itemIndex));
    });

    top += rowHeight;
  });

  parts.push('</svg>');
  return parts.join('\n');
}

function renderCompactCard(profile: CardProfile, options: BaseRenderOptions): string {
  const iconSize = Math.min(options.iconSize, 32);
  const titleHeight = options.hideTitle ? 0 : 58;
  const labelWidth = 170;
  const availableWidth = CARD_WIDTH - HORIZONTAL_PADDING * 2 - labelWidth;
  const cellWidth = iconSize + 18;
  const columns = Math.max(1, Math.floor(availableWidth / cellWidth));
  const heights = profile.groups.map((group) => Math.max(58, Math.ceil(group.items.length / columns) * (iconSize + 14) + 14));
  const height = 18 + titleHeight + heights.reduce((total, value) => total + value, 0);
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" role="img" aria-labelledby="title desc">`,
    `<title id="title">${escapeXml(options.title)}</title>`,
    `<desc id="desc">Compact technology logos grouped by category for ${escapeXml(profile.username)}.</desc>`,
    renderAnimationStyles(options.animated),
    `<rect x="1" y="1" width="${CARD_WIDTH - 2}" height="${height - 2}" rx="16" fill="${options.theme.background}" stroke="${options.theme.border}" stroke-width="2"/>`,
    renderBorderShimmer(options.animated, CARD_WIDTH, height, options.theme.accent),
  ];

  let top = 9;
  if (!options.hideTitle) {
    parts.push(`<text${options.animated ? ' class="card-title-motion" style="animation-delay:80ms"' : ''} x="${CARD_WIDTH / 2}" y="38" text-anchor="middle" fill="${options.theme.text}" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700">${escapeXml(options.title)}</text>`);
    top += titleHeight;
  }

  profile.groups.forEach((group, groupIndex) => {
    const rowHeight = heights[groupIndex] ?? 58;
    if (groupIndex > 0) {
      parts.push(`<line${separatorMotion(options.animated, 120 + groupIndex * 130)} x1="18" y1="${top}" x2="942" y2="${top}" stroke="${options.theme.accent}" stroke-opacity="0.18"/>`);
    }
    parts.push(`<text${labelMotion(options.animated, 110 + groupIndex * 130)} x="24" y="${top + rowHeight / 2 + 5}" fill="${options.theme.accent}" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="600">${escapeXml(group.name)}</text>`);
    group.items.forEach((item, itemIndex) => {
      const column = itemIndex % columns;
      const line = Math.floor(itemIndex / columns);
      const x = HORIZONTAL_PADDING + labelWidth + column * cellWidth;
      const y = top + 12 + line * (iconSize + 14);
      parts.push(renderBareIcon(item.id, item.name, x, y, iconSize, options.theme.text, options.animated, groupIndex * 16 + itemIndex));
    });
    top += rowHeight;
  });

  parts.push('</svg>');
  return parts.join('\n');
}

function renderGridCard(profile: CardProfile, options: BaseRenderOptions): string {
  const gap = 16;
  const cardWidth = (CARD_WIDTH - HORIZONTAL_PADDING * 2 - gap) / 2;
  const padding = Math.max(8, Math.round(options.iconSize * 0.28));
  const tileSize = options.iconSize + padding * 2;
  const cellWidth = tileSize + 13;
  const columns = Math.max(1, Math.floor((cardWidth - 28) / cellWidth));
  const groupHeights = profile.groups.map((group) => 58 + Math.max(1, Math.ceil(group.items.length / columns)) * (tileSize + 12));
  const pairHeights: number[] = [];
  for (let index = 0; index < groupHeights.length; index += 2) {
    pairHeights.push(Math.max(groupHeights[index] ?? 0, groupHeights[index + 1] ?? 0));
  }

  const titleHeight = options.hideTitle ? 0 : 68;
  const height = 20 + titleHeight + pairHeights.reduce((total, value) => total + value + gap, 0);
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" role="img" aria-labelledby="title desc">`,
    `<title id="title">${escapeXml(options.title)}</title>`,
    `<desc id="desc">Technology logos in a category grid for ${escapeXml(profile.username)}.</desc>`,
    renderAnimationStyles(options.animated),
    `<rect x="1" y="1" width="${CARD_WIDTH - 2}" height="${height - 2}" rx="16" fill="${options.theme.background}" stroke="${options.theme.border}" stroke-width="2"/>`,
    renderBorderShimmer(options.animated, CARD_WIDTH, height, options.theme.accent),
  ];

  let top = 10;
  if (!options.hideTitle) {
    parts.push(`<text${options.animated ? ' class="card-title-motion" style="animation-delay:80ms"' : ''} x="${CARD_WIDTH / 2}" y="43" text-anchor="middle" fill="${options.theme.text}" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(options.title)}</text>`);
    top += titleHeight;
  }

  profile.groups.forEach((group, groupIndex) => {
    const columnIndex = groupIndex % 2;
    const pairIndex = Math.floor(groupIndex / 2);
    const pairTop = top + pairHeights.slice(0, pairIndex).reduce((total, value) => total + value + gap, 0);
    const x = HORIZONTAL_PADDING + columnIndex * (cardWidth + gap);
    const cardHeight = pairHeights[pairIndex] ?? 100;
    parts.push(`<rect x="${x}" y="${pairTop}" width="${cardWidth}" height="${cardHeight}" rx="14" fill="${options.theme.tile}" stroke="${options.theme.border}" stroke-opacity="0.32"/>`);
    parts.push(`<text${labelMotion(options.animated, 110 + groupIndex * 130)} x="${x + 16}" y="${pairTop + 32}" fill="${options.theme.accent}" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="600">${escapeXml(group.name)}</text>`);
    group.items.forEach((item, itemIndex) => {
      const iconColumn = itemIndex % columns;
      const iconLine = Math.floor(itemIndex / columns);
      const iconX = x + 14 + iconColumn * cellWidth;
      const iconY = pairTop + 46 + iconLine * (tileSize + 12);
      parts.push(renderIcon(item.id, item.name, iconX, iconY, options.iconSize, options.theme.background, options.theme.border, options.theme.text, options.animated, groupIndex * 16 + itemIndex));
    });
  });

  parts.push('</svg>');
  return parts.join('\n');
}

export function renderCard(profile: CardProfile, options: RenderOptions): string {
  switch (options.layout) {
    case 'compact':
      return renderCompactCard(profile, options);
    case 'grid':
      return renderGridCard(profile, options);
    default:
      return renderRowsCard(profile, options);
  }
}

export function renderErrorCard(message: string, theme: BaseRenderOptions['theme']): string {
  const safeMessage = escapeXml(message);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120" role="img" aria-label="${safeMessage}">
  <rect x="1" y="1" width="598" height="118" rx="14" fill="${theme.background}" stroke="${theme.border}" stroke-width="2"/>
  <text x="300" y="68" text-anchor="middle" fill="${theme.text}" font-family="Segoe UI, Arial, sans-serif" font-size="18">${safeMessage}</text>
</svg>`;
}
