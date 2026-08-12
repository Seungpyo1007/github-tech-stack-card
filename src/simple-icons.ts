import catalog from './simple-icons-catalog.json' with { type: 'json' };

export interface SimpleIconEntry {
  aliases: string[];
  hex: string;
  id: string;
  name: string;
}

export const simpleIconCatalog = catalog as SimpleIconEntry[];
export const simpleIconById = new Map(simpleIconCatalog.map((icon) => [icon.id, icon]));
