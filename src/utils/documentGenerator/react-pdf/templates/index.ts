import { classicTemplate } from './classicTemplate';
import { modernTemplate } from './modernTemplate';
import { greenTemplate } from './greenTemplate';

export const templates = {
  classic: classicTemplate,
  modern: modernTemplate,
  green: greenTemplate
};

export const getTemplate = (templateId: string = 'classic') => {
  return templates[templateId as keyof typeof templates] || templates.classic;
};

export * from './classicTemplate';
export * from './modernTemplate';
export * from './greenTemplate';