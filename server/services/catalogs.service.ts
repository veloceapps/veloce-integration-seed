import { getDirectoryNames } from '../utils/common.utils';

const CATALOGS_DIR = 'source/catalog';

export const getCatalogsNames = async (): Promise<string[]> => {
  return await getDirectoryNames(CATALOGS_DIR);
};

export const getCatalogDefinitions = async (catalog: string): Promise<string[]> => {
  return await getDirectoryNames(`${CATALOGS_DIR}/${catalog}`);
};
