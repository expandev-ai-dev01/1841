/**
 * @summary
 * V1 API router.
 * Organizes external and internal routes for API version 1.
 *
 * @module routes/v1
 */

import { Router } from 'express';
import externalRoutes from './externalRoutes';
import internalRoutes from './internalRoutes';

const router = Router();

router.use('/external', externalRoutes);
router.use('/internal', internalRoutes);

export default router;
