export interface TechItem {
  id: string;
  name: string;
}

export interface TechGroup {
  id: string;
  name: string;
  items: TechItem[];
}

export interface CardProfile {
  username: string;
  groups: TechGroup[];
}

export interface CardTheme {
  background: string;
  border: string;
  accent: string;
  text: string;
  tile: string;
}

export interface BaseRenderOptions {
  animated: boolean;
  hideTitle: boolean;
  iconSize: number;
  theme: CardTheme;
  title: string;
}

export type CardLayout = 'compact' | 'grid' | 'rows';

export interface RenderOptions extends BaseRenderOptions {
  layout: CardLayout;
}

export interface CardRequestOptions extends RenderOptions {
  hidden: Set<string>;
  username: string;
}
