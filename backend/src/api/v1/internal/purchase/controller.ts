/**
 * @summary
 * Purchase controller for CRUD operations.
 * Handles HTTP requests for purchase management.
 *
 * @module api/v1/internal/purchase/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  purchaseCreate,
  purchaseGet,
  purchaseList,
  purchaseUpdate,
  purchaseDelete,
} from '@/services/purchase';

const securable = 'PURCHASE';

/**
 * @api {post} /api/v1/internal/purchase Create Purchase
 * @apiName CreatePurchase
 * @apiGroup Purchase
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new food purchase record
 *
 * @apiParam {String} productName Product name (3-100 characters)
 * @apiParam {Number} quantity Quantity purchased (> 0, max 2 decimals)
 * @apiParam {String} measurementUnit Unit of measurement
 * @apiParam {Number} unitPrice Price per unit (>= 0, max 2 decimals)
 * @apiParam {String} purchaseDate Purchase date (DD/MM/YYYY, not future)
 * @apiParam {String} category Food category
 * @apiParam {String} [purchaseLocation] Store or location (max 100 characters)
 * @apiParam {String} [notes] Additional notes (max 500 characters)
 *
 * @apiSuccess {Number} id Purchase identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    productName: z.string().min(3).max(100),
    quantity: z.coerce.number().positive().max(999.99),
    measurementUnit: z.enum(['kg', 'g', 'l', 'ml', 'unidade', 'pacote', 'caixa', 'duzia']),
    unitPrice: z.coerce.number().min(0).max(99999.99),
    purchaseDate: z.string(),
    category: z.enum([
      'Frutas',
      'Verduras',
      'Carnes',
      'Laticínios',
      'Grãos',
      'Bebidas',
      'Congelados',
      'Padaria',
      'Outros',
    ]),
    purchaseLocation: z.string().max(100).nullable().optional(),
    notes: z.string().max(500).nullable().optional(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params;
    const result = await purchaseCreate({
      ...validated.credential,
      ...data,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

/**
 * @api {get} /api/v1/internal/purchase/:id Get Purchase
 * @apiName GetPurchase
 * @apiGroup Purchase
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a single purchase record by ID
 *
 * @apiParam {Number} id Purchase identifier
 *
 * @apiSuccess {Object} purchase Purchase details
 *
 * @apiError {String} NotFoundError Purchase not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await purchaseGet({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

/**
 * @api {get} /api/v1/internal/purchase List Purchases
 * @apiName ListPurchases
 * @apiGroup Purchase
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists purchases with optional filters and monthly totals
 *
 * @apiParam {String} [startDate] Filter start date (DD/MM/YYYY)
 * @apiParam {String} [endDate] Filter end date (DD/MM/YYYY)
 * @apiParam {String} [category] Filter by category
 * @apiParam {Number} [minValue] Minimum total value filter
 * @apiParam {Number} [maxValue] Maximum total value filter
 * @apiParam {String} [sortBy] Sort criteria
 *
 * @apiSuccess {Array} purchases List of purchases
 * @apiSuccess {Object} monthlyTotal Monthly total information
 * @apiSuccess {Array} categoryTotals Totals by category
 *
 * @apiError {String} ValidationError Invalid filter parameters
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z
    .object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      category: z.string().optional(),
      minValue: z.coerce.number().min(0).optional(),
      maxValue: z.coerce.number().min(0).optional(),
      sortBy: z
        .enum(['date_desc', 'date_asc', 'value_desc', 'value_asc', 'name_asc', 'name_desc'])
        .optional(),
    })
    .optional();

  const [validated, error] = await operation.list(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await purchaseList({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

/**
 * @api {put} /api/v1/internal/purchase/:id Update Purchase
 * @apiName UpdatePurchase
 * @apiGroup Purchase
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing purchase record
 *
 * @apiParam {Number} id Purchase identifier
 * @apiParam {String} productName Product name (3-100 characters)
 * @apiParam {Number} quantity Quantity purchased (> 0, max 2 decimals)
 * @apiParam {String} measurementUnit Unit of measurement
 * @apiParam {Number} unitPrice Price per unit (>= 0, max 2 decimals)
 * @apiParam {String} purchaseDate Purchase date (DD/MM/YYYY, not future)
 * @apiParam {String} category Food category
 * @apiParam {String} [purchaseLocation] Store or location (max 100 characters)
 * @apiParam {String} [notes] Additional notes (max 500 characters)
 *
 * @apiSuccess {Number} id Updated purchase identifier
 *
 * @apiError {String} NotFoundError Purchase not found
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    productName: z.string().min(3).max(100),
    quantity: z.coerce.number().positive().max(999.99),
    measurementUnit: z.enum(['kg', 'g', 'l', 'ml', 'unidade', 'pacote', 'caixa', 'duzia']),
    unitPrice: z.coerce.number().min(0).max(99999.99),
    purchaseDate: z.string(),
    category: z.enum([
      'Frutas',
      'Verduras',
      'Carnes',
      'Laticínios',
      'Grãos',
      'Bebidas',
      'Congelados',
      'Padaria',
      'Outros',
    ]),
    purchaseLocation: z.string().max(100).nullable().optional(),
    notes: z.string().max(500).nullable().optional(),
  });

  const [validated, error] = await operation.update(req, paramsSchema, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const result = await purchaseUpdate({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

/**
 * @api {delete} /api/v1/internal/purchase/:id Delete Purchase
 * @apiName DeletePurchase
 * @apiGroup Purchase
 * @apiVersion 1.0.0
 *
 * @apiDescription Deletes a purchase record and logs the deletion
 *
 * @apiParam {Number} id Purchase identifier
 *
 * @apiSuccess {Number} id Deleted purchase identifier
 *
 * @apiError {String} NotFoundError Purchase not found
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const result = await purchaseDelete({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}
