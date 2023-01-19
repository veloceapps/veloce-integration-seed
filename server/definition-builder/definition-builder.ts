import { ElementDefaultMetadata } from '@veloceapps/sdk/cms';
import { UIDefinition, UIElement } from '@veloceapps/sdk/core';
import { existsSync } from 'fs';
import { getDirectoryNames, readFileSafe, toBase64 } from '../utils/common.utils';
import { extractElementMetadata } from './definition-builder.utils';
import { typeValidator } from './validators';

export class DefinitionBuilder {
  private readonly definitionValidators: Function[] = [typeValidator];
  private readonly elementValidators: Function[] = [typeValidator];
  private readonly rootPath: string = 'source';

  constructor(instance: string) {
    this.rootPath = `source/${instance}`;
  }

  async buildSingle(relativePath: string): Promise<UIDefinition> {
    return await this.parseDefinition(`${this.rootPath}/${relativePath}`);
  }

  async buildMultiple(relativePath: string): Promise<UIDefinition[]> {
    const result: UIDefinition[] = [];
    const definitions = await getDirectoryNames(`${this.rootPath}/${relativePath}`);

    for (const definition of definitions) {
      result.push(await this.buildSingle(`${relativePath}/${definition}`));
    }

    return result;
  }

  private async parseDefinition(path: string): Promise<UIDefinition> {
    if (!existsSync(path)) {
      throw `Definition does not exist in ${path}`;
    }

    const metadata = await readFileSafe(`${path}/metadata.json`);

    const definition = DefinitionBuilder.parseMetadata(metadata, path);

    const children: UIElement[] = [];
    this.validateDefinition(path, definition);

    for (const child of definition.children) {
      children.push(await this.parseElement(`${path}/${child}`));
    }

    return {
      ...definition,
      children,
    };
  }

  private async parseElement(path: string): Promise<UIElement> {
    if (!existsSync(path)) {
      throw `Element does not exist in ${path}`;
    }

    const template = await readFileSafe(`${path}/template.html`);
    const styles = await readFileSafe(`${path}/styles.css`);
    const script = await readFileSafe(`${path}/script.ts`);

    const metadata = extractElementMetadata(script);

    if (!metadata) {
      throw `Please provide decorator with metadata in ${path}/script.ts`;
    }

    const children: UIElement[] = [];
    const element = {
      children,
      template: toBase64(template),
      script: toBase64(script),
      styles: toBase64(styles),
    } as UIElement;

    this.validateElement(path, metadata);

    for (const child of metadata.children ?? []) {
      children.push(await this.parseElement(`${path}/${child}`));
    }

    return {
      ...element,
      children,
    };
  }

  private validateDefinition(path: string, definition: UIDefinition): void {
    this.definitionValidators.forEach(validator => {
      validator.apply(null, [path, definition]);
    });
  }

  private validateElement(path: string, element: ElementDefaultMetadata): void {
    this.elementValidators.forEach(validator => {
      validator.apply(null, [path, element]);
    });
  }

  private static parseMetadata(content: string, path: string): UIDefinition {
    try {
      return JSON.parse(content ?? '{}');
    } catch (e) {
      throw `Error while parsing JSON in ${path}`;
    }
  }
}
