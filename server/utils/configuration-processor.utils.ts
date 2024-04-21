import { ConfigurationProcessor } from '@veloceapps/core';
import { parse as pathParse } from 'path';
import { readFileSafe } from './common.utils';

export const generateConfigurationProcessor = async (
  url: string,
  fileName: string,
  type: 'ACTION' | 'SELECTOR',
): Promise<ConfigurationProcessor> => {
  const name = pathParse(fileName).name;
  const script = await readFileSafe(`${url}/${fileName}`);

  return {
    name,
    apiName: name,
    script,
    type: type as ConfigurationProcessor['type'],
  };
};
