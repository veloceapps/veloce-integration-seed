import { UiDef } from '@veloceapps/core';
import { DefinitionBuilder } from '../definition-builder';
import { exec, getDirectoryNames } from '../utils/common.utils';

const CFG = { dir: 'source/config-ui', useSfdx: true };
// const CFG = { dir: 'data/models', useSfdx: false };

const definitionBuilder = new DefinitionBuilder('models');

export const getModels = async (): Promise<string[]> => {
  return await getDirectoryNames(CFG.dir);
};

export const getModelDefinitions = async (model: string): Promise<string[]> => {
  return await getDirectoryNames(`${CFG.dir}/${model}`);
};

export const getCompiledModelDefinitions = async (modelName: string): Promise<UiDef[]> => {
  if (!CFG.useSfdx) {
    return await definitionBuilder.buildMultiple(modelName);
  }

  const rawResponse = await exec(`sfdx veloce:source:pack -m config-ui:"${modelName}" --json`);

  try {
    const response: { result: UiDef[] } = rawResponse ? JSON.parse(rawResponse) : { result: [] };
    return response.result;
  } catch (_) {
    return [];
  }
};
