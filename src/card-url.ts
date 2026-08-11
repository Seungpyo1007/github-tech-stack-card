import type { CardLayout } from './types.js';

export interface CardUrlOptions {
  animated: boolean;
  colors: {
    accent: string;
    background: string;
    border: string;
    text: string;
    tile: string;
  };
  hideTitle: boolean;
  iconSize: number;
  layout: CardLayout;
  stackToken: string;
  theme: string;
  title: string;
  username: string;
}

export function buildCardSearchParams(options: CardUrlOptions): URLSearchParams {
  const params = new URLSearchParams();
  params.set('username', options.username);
  params.set('stack', options.stackToken);
  params.set('theme', options.theme);
  params.set('layout', options.layout);
  params.set('icon_size', String(options.iconSize));
  params.set('hide_title', String(options.hideTitle));
  params.set('animation', String(options.animated));
  params.set('bg_color', options.colors.background.slice(1));
  params.set('border_color', options.colors.border.slice(1));
  params.set('title_color', options.colors.accent.slice(1));
  params.set('text_color', options.colors.text.slice(1));
  params.set('tile_color', options.colors.tile.slice(1));
  params.set('title', options.title);
  return params;
}

export function buildCardUrl(origin: string, options: CardUrlOptions): string {
  const url = new URL('/api/card', origin);
  url.search = buildCardSearchParams(options).toString();
  return url.toString();
}

export function buildEmbedSnippets(url: string): { html: string; markdown: string } {
  return {
    html: `<img src="${url}" width="100%" alt="Tech stack logos grouped by category" />`,
    markdown: `![Tech stack logos grouped by category](${url})`,
  };
}
