import { Router } from 'express';
import type { Model } from 'mongoose';

export function createCollectionRouter(model: Model<any>): Router {
  const router = Router();

  router.get('/', async (_request, response, next) => {
    try {
      const documents = await model.find().sort({ createdAt: -1 }).lean();
      response.json(documents);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const document = await model.create(request.body);
      response.status(201).json(document);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
