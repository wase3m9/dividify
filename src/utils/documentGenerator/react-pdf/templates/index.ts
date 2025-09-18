import { classicTemplate } from './classicTemplate';
import { modernTemplate } from './modernTemplate';
import { greenTemplate } from './greenTemplate';
import { executiveTemplate } from './executiveTemplate';
import { legalTemplate } from './legalTemplate';
import { corporateEliteTemplate } from './corporateEliteTemplate';
import { royalTemplate } from './royalTemplate';
import { eliteTemplate } from './eliteTemplate';
import { platinumTemplate } from './platinumTemplate';
import { ornateTemplate } from './ornateTemplate';
import { magistrateTemplate } from './magistrateTemplate';

export const templates = {
  classic: classicTemplate,
  modern: modernTemplate,
  green: greenTemplate,
  executive: executiveTemplate,
  legal: legalTemplate,
  corporateElite: corporateEliteTemplate,
  royal: royalTemplate,
  elite: eliteTemplate,
  platinum: platinumTemplate,
  ornate: ornateTemplate,
  magistrate: magistrateTemplate
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
export * from './royalTemplate';
export * from './eliteTemplate';
export * from './platinumTemplate';
export * from './ornateTemplate';
export * from './magistrateTemplate';