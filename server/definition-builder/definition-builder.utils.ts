import { UIElementMetadata } from '@veloce/sdk/cms';

const METADATA_DECORATOR_REGEX = /@ElementDefinition\(([\s\S]+)\)(\n|.)*export class/g;

export const extractElementMetadata = (script: string): UIElementMetadata | undefined => {
  const parsed = METADATA_DECORATOR_REGEX.exec(script);

  if (!parsed) {
    return;
  }

  // need to reset regex last index to prevent null result for next execution
  METADATA_DECORATOR_REGEX.lastIndex = 0;

  return eval(`(${parsed[1]})`);
};
