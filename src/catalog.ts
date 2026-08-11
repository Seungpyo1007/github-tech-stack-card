import type { TechGroup } from './types.js';

export const techCatalog: TechGroup[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    items: [
      { id: 'dart', name: 'Dart' },
      { id: 'flutter', name: 'Flutter' },
      { id: 'swift', name: 'Swift' },
      { id: 'kotlin', name: 'Kotlin' },
      { id: 'java', name: 'Java' },
      { id: 'react', name: 'React Native' },
      { id: 'expo', name: 'Expo' },
      { id: 'android', name: 'Android' },
      { id: 'ios', name: 'iOS' },
    ],
  },
  {
    id: 'web',
    name: 'Web',
    items: [
      { id: 'typescript', name: 'TypeScript' },
      { id: 'javascript', name: 'JavaScript' },
      { id: 'html5', name: 'HTML5' },
      { id: 'css', name: 'CSS' },
      { id: 'sass', name: 'Sass' },
      { id: 'react', name: 'React' },
      { id: 'nextjs', name: 'Next.js' },
      { id: 'express', name: 'Express' },
      { id: 'dotnet', name: '.NET' },
      { id: 'mdx', name: 'MDX' },
    ],
  },
  {
    id: 'ai-ml',
    name: 'AI / ML',
    items: [
      { id: 'python', name: 'Python' },
      { id: 'pytorch', name: 'PyTorch' },
      { id: 'huggingface', name: 'Hugging Face' },
      { id: 'flask', name: 'Flask' },
      { id: 'jupyter', name: 'Jupyter' },
    ],
  },
  {
    id: 'game-hardware',
    name: 'Game / Hardware',
    items: [
      { id: 'csharp', name: 'C#' },
      { id: 'cplusplus', name: 'C++' },
      { id: 'unity', name: 'Unity' },
      { id: 'arduino', name: 'Arduino' },
      { id: 'blender', name: 'Blender' },
    ],
  },
  {
    id: 'cloud-database',
    name: 'Cloud / Database',
    items: [
      { id: 'googlecloud', name: 'Google Cloud' },
      { id: 'aws', name: 'AWS' },
      { id: 'vercel', name: 'Vercel' },
      { id: 'firebase', name: 'Firebase' },
      { id: 'postgresql', name: 'PostgreSQL' },
      { id: 'oracle', name: 'Oracle' },
      { id: 'apache', name: 'Apache' },
      { id: 'nix', name: 'Nix' },
    ],
  },
  {
    id: 'tools',
    name: 'Tools',
    items: [
      { id: 'git', name: 'Git' },
      { id: 'xcode', name: 'Xcode' },
      { id: 'androidstudio', name: 'Android Studio' },
      { id: 'intellijidea', name: 'IntelliJ IDEA' },
      { id: 'rider', name: 'Rider' },
      { id: 'autodesk', name: 'Autodesk' },
    ],
  },
];

export function cloneCatalog(): TechGroup[] {
  return techCatalog.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item })),
  }));
}
