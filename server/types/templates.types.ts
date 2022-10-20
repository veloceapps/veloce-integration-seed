import { UITemplateComponentType, UITemplateType } from '@veloce/core';

export interface Template {
  name: string;
  type: UITemplateType;
  components: TemplateComponent[];
}

export interface TemplateComponent {
  name: string;
  stories: string[];
}

export interface TemplateComponentInfo {
  name: string;
  type: UITemplateComponentType;
  description: string;
}

export interface TemplateComponentMeta extends TemplateComponentInfo {
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
