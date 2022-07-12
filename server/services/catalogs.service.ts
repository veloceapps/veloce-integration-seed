import { getDirectoryNames } from '../utils/common.utils';

const CATALOGS_DIR = 'data/catalogs';

export const getCatalogsNames = async (): Promise<string[]> => {
  return await getDirectoryNames(CATALOGS_DIR);
};

export const getCatalogDefinitions = async (catalog: string): Promise<string[]> => {
  return await getDirectoryNames(`${CATALOGS_DIR}/${catalog}`);
};
