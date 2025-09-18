export * from './basicTemplate';
export * from './classicTemplate';
export * from './modernTemplate';

export const templates = [
  { id: 'basic', name: 'Basic', description: 'Simple and clean layout', isPremium: false },
  { id: 'classic', name: 'Classic', description: 'Traditional design with mint green accents', isPremium: false },
  { id: 'modern', name: 'Modern', description: 'Contemporary design with navy accents', isPremium: false },
  { id: 'executive', name: 'Executive Premium', description: 'Sophisticated dark theme with gold accents for high-end corporate clients', isPremium: true },
  { id: 'legal', name: 'Legal Professional', description: 'Traditional legal document styling with formal compliance features', isPremium: true },
  { id: 'corporateElite', name: 'Corporate Elite', description: 'Ultra-modern design with contemporary styling and premium typography', isPremium: true },
  { id: 'royal', name: 'Royal Collection', description: 'Distinguished navy design with elegant red accents for prestigious documentation', isPremium: true },
  { id: 'elite', name: 'Elite Emerald', description: 'Luxurious green theme with sophisticated styling for premium presentations', isPremium: true },
  { id: 'platinum', name: 'Platinum Series', description: 'Minimalist platinum design with refined elegance and modern aesthetics', isPremium: true },
  { id: 'ornate', name: 'Ornate Classic', description: 'Traditional ornamental design with decorative elements and professional styling', isPremium: true },
  { id: 'magistrate', name: 'Magistrate Bronze', description: 'Authoritative bronze theme with formal presentation and classical appeal', isPremium: true }
] as const;

export type TemplateId = typeof templates[number]['id'];