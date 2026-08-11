import { describe, expect, it } from 'vitest';

import { buildCardSearchParams, buildCardUrl, buildEmbedSnippets } from '../src/card-url.js';

const options = {
  animated: true,
  colors: { accent: '#89CFF0', background: '#0F1B2A', border: '#CBAACB', text: '#FFFFFF', tile: '#132238' },
  hideTitle: false,
  iconSize: 34,
  layout: 'grid' as const,
  stackToken: 'token',
  theme: 'shiny',
  title: 'My Stack',
  username: 'octocat',
};

describe('card URL builder', () => {
  it('uses a stable parameter order', () => {
    expect(buildCardSearchParams(options).toString()).toBe(
      'username=octocat&stack=token&theme=shiny&layout=grid&icon_size=34&hide_title=false&animation=true&bg_color=0F1B2A&border_color=CBAACB&title_color=89CFF0&text_color=FFFFFF&tile_color=132238&title=My+Stack',
    );
  });

  it('creates valid Markdown and HTML snippets', () => {
    const url = buildCardUrl('https://example.com', options);
    const snippets = buildEmbedSnippets(url);
    expect(url).toMatch(/^https:\/\/example\.com\/api\/card\?/u);
    expect(snippets.markdown).toContain(`](${url})`);
    expect(snippets.html).toContain(`src="${url}"`);
  });
});
