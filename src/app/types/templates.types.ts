export interface Template {
  name: string;
  components: TemplateComponent[];
}

export interface TemplateComponent {
  name: string;
  stories: string[];
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