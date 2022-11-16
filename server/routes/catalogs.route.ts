import express, { Request, Response } from 'express';
import { DefinitionBuilder } from '../definition-builder';
import { getCatalogDefinitions, getCatalogsNames } from '../services/catalogs.service';
import { HttpError } from '../types/common.types';

const router = express.Router();
const definitionBuilder = new DefinitionBuilder('catalog');

router.get('/', async (req: Request, res: Response) => {
  try {
    const catalogsNames = await getCatalogsNames();
    res.status(200).json(catalogsNames);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Catalogs list',
      body: e
    };

    res.status(500).json(err);
  }
});

router.get('/:catalogName', async (req: Request, res: Response) => {
  try {
    const catalogsNames = await getCatalogDefinitions(req.params.catalogName);
    res.status(200).json(catalogsNames);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Catalog definitions',
      body: e
    };

    res.status(500).json(err);
  }
});

router.get('/:catalogName/definitions', async (req: Request, res: Response) => {
  try {
    const catalogDefinitions = await definitionBuilder.buildMultiple(`${req.params.catalogName}`);
    res.status(200).json(catalogDefinitions);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Catalog definitions',
      body: e
    };

    res.status(500).json(err);
  }
});

router.get('/:catalogName/:definition', async (req: Request, res: Response) => {
  try {
    const definition = await definitionBuilder.buildSingle(`${req.params.catalogName}/${req.params.definition}`);
    res.status(200).json(definition);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Catalog definition',
      body: e
    };

    res.status(500).json(err);
  }
});

module.exports = router;
