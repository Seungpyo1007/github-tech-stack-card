import { writeFile } from 'node:fs/promises';
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

await writeFile(
  resolve(root, 'src', 'simple-icons-catalog.json'),
  `${JSON.stringify(output)}\n`,
  'utf8',
);

console.log(`Generated ${output.length} searchable technology icons.`);
