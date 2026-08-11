import { getTheme } from './themes.js';
import type { CardLayout, CardRequestOptions, CardTheme } from './types.js';

type QueryValue = string | string[] | undefined;
export type CardQuery = Record<string, QueryValue>;

const colorPattern = /^(?:#|%23)?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const layouts = new Set<CardLayout>(['compact', 'grid', 'rows']);
const safeIdentifier = /^[a-z0-9-]+$/;
const safeUsername = /^[A-Za-z0-9-]{1,39}$/;

function first(value: QueryValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseColor(value: QueryValue, fallback: string): string {
  const match = first(value)?.match(colorPattern);
  if (!match?.[1]) return fallback;
  const color = match[1];
  const expanded = color.length === 3 ? color.split('').map((character) => character.repeat(2)).join('') : color;
  return `#${expanded.toUpperCase()}`;
}

function parseInteger(value: QueryValue, fallback: number, minimum: number, maximum: number): number {
  const number = Number.parseInt(first(value) ?? '', 10);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function parseBoolean(value: QueryValue): boolean {
  return ['1', 'true', 'yes'].includes((first(value) ?? '').toLowerCase());
}

function parseAnimation(value: QueryValue): boolean {
  return !['0', 'false', 'no', 'none'].includes((first(value) ?? '').toLowerCase());
}

function parseHidden(value: QueryValue): Set<string> {
  const entries = (first(value) ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => safeIdentifier.test(entry));
  return new Set(entries.slice(0, 100));
}

function withCustomColors(theme: CardTheme, query: CardQuery): CardTheme {
  return {
    ...theme,
    accent: parseColor(query.title_color, theme.accent),
    background: parseColor(query.bg_color, theme.background),
    border: parseColor(query.border_color, theme.border),
    text: parseColor(query.text_color, theme.text),
    tile: parseColor(query.tile_color, theme.tile),
  };
}

function parseTitle(value: QueryValue): string {
  const title = [...(first(value) ?? 'Tech Stack')]
    .filter((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127)
    .join('')
    .trim();
  return title ? [...title].slice(0, 48).join('') : 'Tech Stack';
}

export function parseCardOptions(query: CardQuery): CardRequestOptions {
  const requestedUsername = first(query.username) ?? 'Seungpyo1007';
  const username = safeUsername.test(requestedUsername) ? requestedUsername : 'Seungpyo1007';
  const requestedLayout = (first(query.layout) ?? 'rows') as CardLayout;
  const layout = layouts.has(requestedLayout) ? requestedLayout : 'rows';
  const themeName = first(query.theme) ?? 'shiny';
  const baseTheme = getTheme(themeName);

  return {
    animated: parseAnimation(query.animation),
    hidden: parseHidden(query.hide),
    hideTitle: parseBoolean(query.hide_title),
    iconSize: parseInteger(query.icon_size, 34, 24, 48),
    layout,
    stackToken: first(query.stack) ?? null,
    theme: withCustomColors(baseTheme, query),
    title: parseTitle(query.title),
    username,
  };
}
