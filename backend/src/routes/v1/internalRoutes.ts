/**
 * @summary
 * Internal (authenticated) routes configuration for V1.
 * Handles authenticated API endpoints.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as purchaseController from '@/api/v1/internal/purchase/controller';

const router = Router();

router.get('/purchase', purchaseController.listHandler);
router.post('/purchase', purchaseController.createHandler);
router.get('/purchase/:id', purchaseController.getHandler);
router.put('/purchase/:id', purchaseController.updateHandler);
router.delete('/purchase/:id', purchaseController.deleteHandler);

export default router;
