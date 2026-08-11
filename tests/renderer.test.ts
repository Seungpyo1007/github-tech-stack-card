import sharp from 'sharp';
import { XMLValidator } from 'fast-xml-parser';
import { describe, expect, it } from 'vitest';

import { parseCardOptions } from '../src/options.js';
import { getProfile } from '../src/profiles.js';
import { renderCard } from '../src/render/card.js';
import type { CardLayout } from '../src/types.js';

function svgSummary(svg: string, layout: CardLayout) {
  const root = svg.match(/<svg[^>]*width="(\d+)" height="(\d+)"/);
  return {
    height: Number(root?.[2]),
    layout,
    nestedIcons: (svg.match(/<svg x=/g) ?? []).length,
    separators: (svg.match(/<line /g) ?? []).length,
    width: Number(root?.[1]),
  };
}

describe('SVG card renderer', () => {
  const profile = getProfile('Seungpyo1007')!;

  it.each<CardLayout>(['rows', 'grid', 'compact'])('renders a valid %s card as PNG', async (layout) => {
    const options = parseCardOptions({ hide_title: 'true', layout });
    const svg = renderCard(profile, options);

    expect(XMLValidator.validate(svg)).toBe(true);
    const { info } = await sharp(Buffer.from(svg)).png().toBuffer({ resolveWithObject: true });
    expect(info.format).toBe('png');
    expect(info.width).toBe(960);
    expect(info.height).toBeGreaterThan(300);
    expect(svgSummary(svg, layout)).toMatchSnapshot();
  });

  it('escapes user-visible title content', () => {
    const options = parseCardOptions({});
    const svg = renderCard(profile, { ...options, title: '<script>alert(1)</script>' });
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
  });
});
