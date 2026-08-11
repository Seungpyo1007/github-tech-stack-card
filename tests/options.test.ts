import { describe, expect, it } from 'vitest';

import { parseCardOptions } from '../src/options.js';

describe('parseCardOptions', () => {
  it('uses the Seungpyo shiny rows preset by default', () => {
    const options = parseCardOptions({});
    expect(options).toMatchObject({
      hideTitle: false,
      iconSize: 34,
      layout: 'rows',
      username: 'Seungpyo1007',
    });
    expect(options.theme).toEqual({
      accent: '#89CFF0',
      background: '#0F1B2A',
      border: '#CBAACB',
      text: '#FFFFFF',
      tile: '#132238',
    });
  });

  it('accepts supported layout, visibility, size, hide, and color options', () => {
    const options = parseCardOptions({
      bg_color: 'abc',
      border_color: '#123456',
      hide: 'tools,react,INVALID VALUE',
      hide_title: 'true',
      icon_size: '80',
      layout: 'grid',
      text_color: ['fff'],
      title_color: '%2389c',
    });

    expect(options.layout).toBe('grid');
    expect(options.hideTitle).toBe(true);
    expect(options.iconSize).toBe(48);
    expect([...options.hidden]).toEqual(['tools', 'react']);
    expect(options.theme).toMatchObject({
      accent: '#8899CC',
      background: '#AABBCC',
      border: '#123456',
      text: '#FFFFFF',
    });
  });

  it('falls back safely for invalid input', () => {
    const options = parseCardOptions({
      bg_color: '<script>',
      icon_size: 'not-a-number',
      layout: 'unknown',
      username: '../../etc/passwd',
    });

    expect(options.layout).toBe('rows');
    expect(options.iconSize).toBe(34);
    expect(options.username).toBe('Seungpyo1007');
    expect(options.theme.background).toBe('#0F1B2A');
  });
});
