/**
 * @summary
 * Purchase type definitions.
 * Defines interfaces for purchase-related operations.
 *
 * @module services/purchase/purchaseTypes
 */

/**
 * @interface PurchaseEntity
 * @description Represents a purchase entity in the system
 *
 * @property {number} id - Unique purchase identifier
 * @property {string} productName - Name of the food product
 * @property {number} quantity - Quantity purchased
 * @property {string} measurementUnit - Unit of measurement
 * @property {number} unitPrice - Price per unit
 * @property {number} totalValue - Total purchase value
 * @property {string} purchaseDate - Date of purchase
 * @property {string} category - Food category
 * @property {string | null} purchaseLocation - Store or location
 * @property {string | null} notes - Additional notes
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface PurchaseEntity {
  id: number;
  productName: string;
  quantity: number;
  measurementUnit: string;
  unitPrice: number;
  totalValue: number;
  purchaseDate: string;
  category: string;
  purchaseLocation: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface PurchaseCreateRequest
 * @description Request parameters for creating a purchase
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} productName - Name of the food product
 * @property {number} quantity - Quantity purchased
 * @property {string} measurementUnit - Unit of measurement
 * @property {number} unitPrice - Price per unit
 * @property {string} purchaseDate - Date of purchase
 * @property {string} category - Food category
 * @property {string} [purchaseLocation] - Store or location
 * @property {string} [notes] - Additional notes
 */
export interface PurchaseCreateRequest {
  idAccount: number;
  idUser: number;
  productName: string;
  quantity: number;
  measurementUnit: string;
  unitPrice: number;
  purchaseDate: string;
  category: string;
  purchaseLocation?: string;
  notes?: string;
}

/**
 * @interface PurchaseGetRequest
 * @description Request parameters for retrieving a purchase
 *
 * @property {number} idAccount - Account identifier
 * @property {number} id - Purchase identifier
 */
export interface PurchaseGetRequest {
  idAccount: number;
  id: number;
}

/**
 * @interface PurchaseListRequest
 * @description Request parameters for listing purchases
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [startDate] - Filter start date
 * @property {string} [endDate] - Filter end date
 * @property {string} [category] - Filter by category
 * @property {number} [minValue] - Minimum value filter
 * @property {number} [maxValue] - Maximum value filter
 * @property {string} [sortBy] - Sort criteria
 */
export interface PurchaseListRequest {
  idAccount: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  minValue?: number;
  maxValue?: number;
  sortBy?: string;
}

/**
 * @interface PurchaseUpdateRequest
 * @description Request parameters for updating a purchase
 *
 * @property {number} idAccount - Account identifier
 * @property {number} id - Purchase identifier
 * @property {string} productName - Name of the food product
 * @property {number} quantity - Quantity purchased
 * @property {string} measurementUnit - Unit of measurement
 * @property {number} unitPrice - Price per unit
 * @property {string} purchaseDate - Date of purchase
 * @property {string} category - Food category
 * @property {string} [purchaseLocation] - Store or location
 * @property {string} [notes] - Additional notes
 */
export interface PurchaseUpdateRequest {
  idAccount: number;
  id: number;
  productName: string;
  quantity: number;
  measurementUnit: string;
  unitPrice: number;
  purchaseDate: string;
  category: string;
  purchaseLocation?: string;
  notes?: string;
}

/**
 * @interface PurchaseDeleteRequest
 * @description Request parameters for deleting a purchase
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} id - Purchase identifier
 */
export interface PurchaseDeleteRequest {
  idAccount: number;
  idUser: number;
  id: number;
}

/**
 * @interface MonthlyTotal
 * @description Monthly total information
 *
 * @property {number} totalValue - Total value for period
 * @property {string} periodStart - Start date of period
 * @property {string} periodEnd - End date of period
 */
export interface MonthlyTotal {
  totalValue: number;
  periodStart: string;
  periodEnd: string;
}

/**
 * @interface CategoryTotal
 * @description Category total information
 *
 * @property {string} category - Food category
 * @property {number} totalValue - Total value for category
 */
export interface CategoryTotal {
  category: string;
  totalValue: number;
}

/**
 * @interface PurchaseListResponse
 * @description Response for purchase list operation
 *
 * @property {PurchaseEntity[]} purchases - List of purchases
 * @property {MonthlyTotal} monthlyTotal - Monthly total information
 * @property {CategoryTotal[]} categoryTotals - Totals by category
 */
export interface PurchaseListResponse {
  purchases: PurchaseEntity[];
  monthlyTotal: MonthlyTotal;
  categoryTotals: CategoryTotal[];
}
