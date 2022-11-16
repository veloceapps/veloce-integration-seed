import { existsSync, promises as fs } from 'fs';
import {
  Template,
  TemplateComponent,
  TemplateComponentInfo,
  TemplateComponentMeta,
  TemplateComponentStory,
} from '../types/templates.types';

const TEMPLATES_DIR = 'data/templates';
const STORIES_DIR = 'stories';

const readFileSafe = async (dir: string): Promise<string> => {
  try {
    const raw = await fs.readFile(dir);
    return raw.toString();
  } catch (e) {
    return '';
  }
};

const getDirectoryNames = async (dir: string): Promise<string[]> => {
  if (!existsSync(dir)) {
    return [];
  }

  const result = await fs.readdir(dir, { withFileTypes: true });
  return result.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
};

const getStories = async (templateName: string, componentName: string): Promise<string[]> => {
  return getDirectoryNames(`${TEMPLATES_DIR}/${templateName}/${componentName}/${STORIES_DIR}`);
};

const getComponents = async (templateName: string): Promise<string[]> => {
  return getDirectoryNames(`${TEMPLATES_DIR}/${templateName}`);
};

export const getTemplates = async (): Promise<Template[]> => {
  if (!existsSync(TEMPLATES_DIR)) {
    return [];
  }

  const result: Template[] = [];
  const templates = await getDirectoryNames(TEMPLATES_DIR);

  for (const [i, templateName] of templates.entries()) {
    const templateMetadataRaw = await readFileSafe(`${TEMPLATES_DIR}/${templateName}/metadata.json`);
    const templateMetadata = JSON.parse(templateMetadataRaw);
    const template: Template = { name: templateName, type: templateMetadata.type, components: [] };

    const components = await getComponents(templateName);
    for (const [j, componentName] of components.entries()) {
      const stories = await getStories(templateName, componentName);
      const component: TemplateComponent = { name: componentName, stories };
      template.components[j] = component;
    }

    result[i] = template;
  }

  return result;
};

export const getTemplateComponents = async (templateName: string): Promise<TemplateComponentMeta[]> => {
  const componentNames = await getComponents(templateName);
  return Promise.all(
    componentNames.map(async componentName => {
      const componentDir = `${TEMPLATES_DIR}/${templateName}/${componentName}`;

      const infoRaw = await readFileSafe(`${componentDir}/metadata.json`);
      const componentTemplate = await readFileSafe(`${componentDir}/template.html`);
      const componentStyles = await readFileSafe(`${componentDir}/styles.css`);
      const componentTsScript = await readFileSafe(`${componentDir}/script.ts`);
      const componentJsScript = await readFileSafe(`${componentDir}/script.js`);
      const componentProperties = await readFileSafe(`${componentDir}/properties.json`);

      const info = JSON.parse(infoRaw) as TemplateComponentInfo;
      const meta: TemplateComponentMeta = {
        ...info,
        template: componentTemplate,
        styles: componentStyles,
        script: componentTsScript || componentJsScript,
        properties: componentProperties,
      };
      return meta;
    }),
  );
};

export const getStoryMetadata = async (
  templateName: string,
  componentName: string,
  storyName: string,
): Promise<TemplateComponentStory> => {
  const componentDir = `${TEMPLATES_DIR}/${templateName}/${componentName}`;
  const storyDir = `${componentDir}/${STORIES_DIR}/${storyName}`;

  const componentTemplate = await readFileSafe(`${componentDir}/template.html`);
  const componentStyles = await readFileSafe(`${componentDir}/styles.css`);
  const componentScript = await readFileSafe(`${componentDir}/script.js`);
  const componentProperties = await readFileSafe(`${componentDir}/properties.json`);
  const template = await readFileSafe(`${storyDir}/template.html`);
  const styles = await readFileSafe(`${storyDir}/styles.css`);
  const script = await readFileSafe(`${storyDir}/script.js`);
  const section = await readFileSafe(`${storyDir}/section.json`);

  return {
    name: storyName,
    componentTemplate,
    componentStyles,
    componentScript,
    componentProperties,
    template,
    styles,
    script,
    section,
  };
};
