import express, { Request, Response } from 'express';
import {
  getStoryMetadata,
  getTemplateComponents,
  getTemplateProcessors,
  getTemplates,
} from '../services/templates.service';
import { HttpError } from '../types/common.types';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const templates = await getTemplates();
    res.status(200).json(templates);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Templates list',
      body: e,
    };

    res.status(500).json(err);
  }
});

router.get('/processors/:templateName', async (req: Request, res: Response) => {
  try {
    const processors = await getTemplateProcessors(req.params.templateName);
    res.status(200).json(processors);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Template processors list',
      body: e,
    };

    res.status(500).json(err);
  }
});

router.get('/:templateName', async (req: Request, res: Response) => {
  try {
    const components = await getTemplateComponents(req.params.templateName);
    res.status(200).json(components);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Template components',
      body: e,
    };

    res.status(500).json(err);
  }
});

router.get('/:templateName/:componentName/:storyName', async (req: Request, res: Response) => {
  try {
    const storyMetadata = await getStoryMetadata(
      req.params.templateName,
      req.params.componentName,
      req.params.storyName,
    );
    res.status(200).json(storyMetadata);
  } catch (e) {
    console.error(e);

    const err: HttpError = {
      status: 500,
      message: 'Failed to get Story metadata',
      body: e,
    };

    res.status(500).json(err);
  }
});

module.exports = router;
