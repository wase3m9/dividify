export * from './basicTemplate';
export * from './classicTemplate';
export * from './modernTemplate';

export const templates = [
  { id: 'basic', name: 'Basic', description: 'Simple and clean layout', isPremium: false },
  { id: 'classic', name: 'Classic', description: 'Traditional design with mint green accents', isPremium: false },
  { id: 'modern', name: 'Modern', description: 'Contemporary design with navy accents', isPremium: false },
  { id: 'executive', name: 'Executive Premium', description: 'Sophisticated dark theme with gold accents for high-end corporate clients', isPremium: true },
  { id: 'legal', name: 'Legal Professional', description: 'Traditional legal document styling with formal compliance features', isPremium: true },
  { id: 'corporateElite', name: 'Corporate Elite', description: 'Ultra-modern design with contemporary styling and premium typography', isPremium: true }
] as const;

export type TemplateId = typeof templates[number]['id'];