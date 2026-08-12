import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import icons from 'simple-icons/icons.json' with { type: 'json' };

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = icons.map((icon) => ({
  id: icon.slug,
  name: icon.title,
  hex: `#${icon.hex}`,
  aliases: [...(icon.aliases?.aka ?? []), ...(icon.aliases?.dupe ?? [])]
    .filter((alias) => typeof alias === 'string'),
}));
const iconData = {};

for (const icon of icons) {
  const source = await readFile(
    resolve(root, 'node_modules', 'simple-icons', 'icons', `${icon.slug}.svg`),
    'utf8',
  );
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const inner = source
    .match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1]
    ?.replace(/<title>[\s\S]*?<\/title>/g, '')
    .trim();
  if (!inner) throw new Error(`Invalid Simple Icon asset: ${icon.slug}`);
  iconData[icon.slug] = { inner, viewBox };
}

await writeFile(
  resolve(root, 'src', 'simple-icons-catalog.json'),
  `${JSON.stringify(output)}\n`,
  'utf8',
);
await writeFile(
  resolve(root, 'assets', 'simple-icons-data.json'),
  `${JSON.stringify(iconData)}\n`,
  'utf8',
);

console.log(`Generated ${output.length} searchable technology icons.`);
