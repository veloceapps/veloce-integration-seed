import { ElementMetadata } from '@veloceapps/sdk/cms';

export const typeValidator = (path: string, metadata: ElementMetadata) => {
  if (!metadata.type) {
    throw `Element type is not specified in ${path}/metadata.json`;
  }
};
