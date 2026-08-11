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
  hideTitle: boolean;
  iconSize: number;
  theme: CardTheme;
  title: string;
}
