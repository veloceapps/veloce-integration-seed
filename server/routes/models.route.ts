import express, { Request, Response } from 'express';
import { getCompiledModelDefinitions, getModelDefinitions, getModels } from '../services/models.service';
import { HttpError } from '../types/common.types';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const modelsNames = await getModels();
    res.status(200).json(modelsNames);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Models list',
      body: e
    };

    res.status(500).json(err);
  }
});

router.get('/:modelName', async (req: Request, res: Response) => {
  try {
    const modelMetadata = await getModelDefinitions(req.params.modelName);
    res.status(200).json(modelMetadata);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Model metadata',
      body: e
    };

    res.status(500).json(err);
  }
});

router.get('/:modelName/definitions', async (req: Request, res: Response) => {
  try {
    const modelMetadata = await getCompiledModelDefinitions(req.params.modelName);
    res.status(200).json(modelMetadata);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Model metadata',
      body: e
    };

    res.status(500).json(err);
  }
});

router.get('/:modelName/:definition', async (req: Request, res: Response) => {
  try {
    const { modelName, definition } = req.params ?? {};
    const uiDefinitions = await getCompiledModelDefinitions(modelName);
    const uiDefinition = uiDefinitions.find(uiDef => uiDef.name === definition);

    if (!uiDefinition) {
      throw new Error(`No definition ${definition} found on model ${modelName}`);
    }

    res.status(200).json(uiDefinition);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Model metadata. ' + e?.message ?? '',
      body: e
    };

    res.status(500).json(err);
  }
});

module.exports = router;
