import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(root, 'assets', 'icons');

const sources = {
  android: 'https://cdn.simpleicons.org/android',
  androidstudio: 'https://cdn.simpleicons.org/androidstudio',
  apache: 'https://cdn.simpleicons.org/apache',
  arduino: 'https://cdn.simpleicons.org/arduino',
  autodesk: 'https://cdn.simpleicons.org/autodesk/FFFFFF',
  aws: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  blender: 'https://cdn.simpleicons.org/blender',
  cplusplus: 'https://cdn.simpleicons.org/cplusplus',
  csharp: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
  css: 'https://cdn.simpleicons.org/css',
  dart: 'https://cdn.simpleicons.org/dart',
  dotnet: 'https://cdn.simpleicons.org/dotnet',
  expo: 'https://cdn.simpleicons.org/expo/FFFFFF',
  express: 'https://cdn.simpleicons.org/express/FFFFFF',
  firebase: 'https://cdn.simpleicons.org/firebase',
  flask: 'https://cdn.simpleicons.org/flask/FFFFFF',
  flutter: 'https://cdn.simpleicons.org/flutter',
  git: 'https://cdn.simpleicons.org/git',
  googlecloud: 'https://cdn.simpleicons.org/googlecloud',
  html5: 'https://cdn.simpleicons.org/html5',
  huggingface: 'https://cdn.simpleicons.org/huggingface',
  intellijidea: 'https://cdn.simpleicons.org/intellijidea/FFFFFF',
  ios: 'https://cdn.simpleicons.org/apple/FFFFFF',
  java: 'https://cdn.simpleicons.org/openjdk/FFFFFF',
  javascript: 'https://cdn.simpleicons.org/javascript',
  jupyter: 'https://cdn.simpleicons.org/jupyter',
  kotlin: 'https://cdn.simpleicons.org/kotlin',
  mdx: 'https://cdn.simpleicons.org/mdx/FFFFFF',
  nextjs: 'https://cdn.simpleicons.org/nextdotjs/FFFFFF',
  nix: 'https://cdn.simpleicons.org/nixos',
  oracle: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg',
  postgresql: 'https://cdn.simpleicons.org/postgresql',
  python: 'https://cdn.simpleicons.org/python',
  pytorch: 'https://cdn.simpleicons.org/pytorch',
  react: 'https://cdn.simpleicons.org/react',
  rider: 'https://cdn.simpleicons.org/rider/FFFFFF',
  sass: 'https://cdn.simpleicons.org/sass',
  swift: 'https://cdn.simpleicons.org/swift',
  typescript: 'https://cdn.simpleicons.org/typescript',
  unity: 'https://cdn.simpleicons.org/unity/FFFFFF',
  vercel: 'https://cdn.simpleicons.org/vercel/FFFFFF',
  xcode: 'https://cdn.simpleicons.org/xcode',
};

await mkdir(outputDirectory, { recursive: true });

for (const [name, url] of Object.entries(sources)) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to fetch ${name}: ${response.status}`);
  }

  const svg = await response.text();
  if (!svg.includes('<svg')) {
    throw new Error(`Invalid SVG response for ${name}`);
  }

  await writeFile(resolve(outputDirectory, `${name}.svg`), svg, 'utf8');
}

console.log(`Fetched ${Object.keys(sources).length} icons.`);
