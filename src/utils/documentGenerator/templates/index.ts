export * from './basicTemplate';
export * from './classicTemplate';
export * from './modernTemplate';

export const templates = [
  { id: 'basic', name: 'Basic', description: 'Simple and clean layout' },
  { id: 'classic', name: 'Classic', description: 'Traditional design with mint green accents' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design with navy accents' }
] as const;

export type TemplateId = typeof templates[number]['id'];