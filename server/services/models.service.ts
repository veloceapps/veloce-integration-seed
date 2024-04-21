import { ConfigurationProcessor, UIDefinitionContainer } from '@veloceapps/core';
import { parse as pathParse } from 'path';
import { exec, getDirectoryNames, getFileNames, readFileSafe } from '../utils/common.utils';
import { generateConfigurationProcessor } from '../utils/configuration-processor.utils';

const CONFIG_UI_DIR = 'source/config-ui';

const getConfigurationUIProcessors = async (
  modelName: string,
  uiName: string,
  type: 'ACTION' | 'SELECTOR',
): Promise<ConfigurationProcessor[]> => {
  const url = `${CONFIG_UI_DIR}/${modelName}/${uiName}`;
  const folderName = type === 'ACTION' ? 'actions' : 'selectors';
  const processorNames = await getFileNames(`${url}/${folderName}`);
  const processors = await Promise.all(
    processorNames.map(processor => generateConfigurationProcessor(`${url}/${folderName}`, processor, type)),
  );

  if (!processors.length) {
    return [];
  }

  return processors.map(processor => ({ ...processor, ownerId: uiName }));
};

export const getModels = async (): Promise<string[]> => {
  return await getDirectoryNames(CONFIG_UI_DIR);
};

export const getModelDefinitions = async (model: string): Promise<string[]> => {
  return await getDirectoryNames(`${CONFIG_UI_DIR}/${model}`);
};

export const getCompiledModelDefinitions = async (modelName: string): Promise<UIDefinitionContainer[]> => {
  try {
    const builtDefinitionsFolder = `dist/config-ui/${modelName}`;
    await exec(`rm -rf ${builtDefinitionsFolder}`);
    await exec(`sfdx veloce:source:pack -m config-ui:"${modelName}" -o dist/config-ui`);
    const configUiFilenames = await getFileNames(`dist/config-ui/${modelName}`);

    const uiDefContainers: UIDefinitionContainer[] = [];
    for (const uiFileName of configUiFilenames) {
      const name = pathParse(uiFileName).name;
      const builtDefinitionUrl = `${builtDefinitionsFolder}/${uiFileName}`;

      uiDefContainers.push({
        id: name,
        modelId: '',
        source: JSON.parse(await readFileSafe(builtDefinitionUrl)),
        actions: await getConfigurationUIProcessors(modelName, name, 'ACTION'),
        selectors: await getConfigurationUIProcessors(modelName, name, 'SELECTOR'),
      });
    }

    return uiDefContainers;
  } catch (_) {
    return [];
  }
};
