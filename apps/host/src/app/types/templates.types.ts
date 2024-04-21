import { UITemplateComponentType, UITemplateType } from '@veloceapps/core';

export interface Template {
  id: string;
  name: string;
  type: UITemplateType;
  components: TemplateComponent[];
}

export interface TemplateComponent {
  name: string;
  stories: string[];
}

export interface TemplateComponentMeta {
  name: string;
  type: UITemplateComponentType;
  description: string;
  template: string;
  styles: string;
  script: string;
  properties: string;
}

export interface TemplateComponentStory {
  name: string;
  componentTemplate: string;
  componentStyles: string;
  componentScript: string;
  componentProperties: string;
  template: string;
  styles: string;
  script: string;
  section: string;
}
