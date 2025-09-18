import { classicTemplate } from './classicTemplate';
import { modernTemplate } from './modernTemplate';
import { greenTemplate } from './greenTemplate';
import { executiveTemplate } from './executiveTemplate';
import { legalTemplate } from './legalTemplate';
import { corporateEliteTemplate } from './corporateEliteTemplate';

export const templates = {
  classic: classicTemplate,
  modern: modernTemplate,
  green: greenTemplate,
  executive: executiveTemplate,
  legal: legalTemplate,
  corporateElite: corporateEliteTemplate
};

export const getTemplate = (templateId: string = 'classic') => {
  return templates[templateId as keyof typeof templates] || templates.classic;
};

export * from './classicTemplate';
export * from './modernTemplate';
export * from './greenTemplate';
export * from './executiveTemplate';
export * from './legalTemplate';
export * from './corporateEliteTemplate';