/**
 * @summary
 * Purchase business logic services.
 * Implements CRUD operations for purchase management.
 *
 * @module services/purchase/purchaseRules
 */

import { getPool } from '@/utils/database';
import {
  PurchaseCreateRequest,
  PurchaseGetRequest,
  PurchaseListRequest,
  PurchaseUpdateRequest,
  PurchaseDeleteRequest,
  PurchaseEntity,
  PurchaseListResponse,
} from './purchaseTypes';
import { IResult } from 'mssql';

/**
 * @summary
 * Creates a new purchase record
 *
 * @function purchaseCreate
 * @module purchase
 *
 * @param {PurchaseCreateRequest} params - Purchase creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.productName - Product name
 * @param {number} params.quantity - Quantity purchased
 * @param {string} params.measurementUnit - Unit of measurement
 * @param {number} params.unitPrice - Price per unit
 * @param {string} params.purchaseDate - Purchase date
 * @param {string} params.category - Food category
 * @param {string} params.purchaseLocation - Store or location
 * @param {string} params.notes - Additional notes
 *
 * @returns {Promise<{ id: number }>} Created purchase identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function purchaseCreate(params: PurchaseCreateRequest): Promise<{ id: number }> {
  const pool = await getPool();
  const result: IResult<any> = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('productName', params.productName)
    .input('quantity', params.quantity)
    .input('measurementUnit', params.measurementUnit)
    .input('unitPrice', params.unitPrice)
    .input('purchaseDate', params.purchaseDate)
    .input('category', params.category)
    .input('purchaseLocation', params.purchaseLocation || null)
    .input('notes', params.notes || null)
    .execute('spPurchaseCreate');

  return result.recordset[0];
}

/**
 * @summary
 * Retrieves a single purchase record by ID
 *
 * @function purchaseGet
 * @module purchase
 *
 * @param {PurchaseGetRequest} params - Purchase retrieval parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.id - Purchase identifier
 *
 * @returns {Promise<PurchaseEntity>} Purchase details
 *
 * @throws {NotFoundError} When purchase does not exist
 * @throws {DatabaseError} When database operation fails
 */
export async function purchaseGet(params: PurchaseGetRequest): Promise<PurchaseEntity> {
  const pool = await getPool();
  const result: IResult<any> = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('id', params.id)
    .execute('spPurchaseGet');

  return result.recordset[0];
}

/**
 * @summary
 * Lists purchases with optional filters and calculates totals
 *
 * @function purchaseList
 * @module purchase
 *
 * @param {PurchaseListRequest} params - Purchase list parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} params.startDate - Filter start date
 * @param {string} params.endDate - Filter end date
 * @param {string} params.category - Filter by category
 * @param {number} params.minValue - Minimum value filter
 * @param {number} params.maxValue - Maximum value filter
 * @param {string} params.sortBy - Sort criteria
 *
 * @returns {Promise<PurchaseListResponse>} Purchase list with totals
 *
 * @throws {ValidationError} When filter parameters are invalid
 * @throws {DatabaseError} When database operation fails
 */
export async function purchaseList(params: PurchaseListRequest): Promise<PurchaseListResponse> {
  const pool = await getPool();
  const result: IResult<any> = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('startDate', params.startDate || null)
    .input('endDate', params.endDate || null)
    .input('category', params.category || null)
    .input('minValue', params.minValue || null)
    .input('maxValue', params.maxValue || null)
    .input('sortBy', params.sortBy || 'date_desc')
    .execute('spPurchaseList');

  const recordsets = result.recordsets as any[];

  return {
    purchases: recordsets[0],
    monthlyTotal: recordsets[1][0],
    categoryTotals: recordsets[2],
  };
}

/**
 * @summary
 * Updates an existing purchase record
 *
 * @function purchaseUpdate
 * @module purchase
 *
 * @param {PurchaseUpdateRequest} params - Purchase update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.id - Purchase identifier
 * @param {string} params.productName - Product name
 * @param {number} params.quantity - Quantity purchased
 * @param {string} params.measurementUnit - Unit of measurement
 * @param {number} params.unitPrice - Price per unit
 * @param {string} params.purchaseDate - Purchase date
 * @param {string} params.category - Food category
 * @param {string} params.purchaseLocation - Store or location
 * @param {string} params.notes - Additional notes
 *
 * @returns {Promise<{ id: number }>} Updated purchase identifier
 *
 * @throws {NotFoundError} When purchase does not exist
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function purchaseUpdate(params: PurchaseUpdateRequest): Promise<{ id: number }> {
  const pool = await getPool();
  const result: IResult<any> = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('id', params.id)
    .input('productName', params.productName)
    .input('quantity', params.quantity)
    .input('measurementUnit', params.measurementUnit)
    .input('unitPrice', params.unitPrice)
    .input('purchaseDate', params.purchaseDate)
    .input('category', params.category)
    .input('purchaseLocation', params.purchaseLocation || null)
    .input('notes', params.notes || null)
    .execute('spPurchaseUpdate');

  return result.recordset[0];
}

/**
 * @summary
 * Deletes a purchase record and logs the deletion
 *
 * @function purchaseDelete
 * @module purchase
 *
 * @param {PurchaseDeleteRequest} params - Purchase deletion parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.id - Purchase identifier
 *
 * @returns {Promise<{ id: number }>} Deleted purchase identifier
 *
 * @throws {NotFoundError} When purchase does not exist
 * @throws {DatabaseError} When database operation fails
 */
export async function purchaseDelete(params: PurchaseDeleteRequest): Promise<{ id: number }> {
  const pool = await getPool();
  const result: IResult<any> = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('id', params.id)
    .execute('spPurchaseDelete');

  return result.recordset[0];
}
