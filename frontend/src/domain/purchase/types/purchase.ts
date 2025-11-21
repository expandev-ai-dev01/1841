export type MeasurementUnit = 'kg' | 'g' | 'l' | 'ml' | 'unidade' | 'pacote' | 'caixa' | 'duzia';

export type Category =
  | 'Frutas'
  | 'Verduras'
  | 'Carnes'
  | 'Laticínios'
  | 'Grãos'
  | 'Bebidas'
  | 'Congelados'
  | 'Padaria'
  | 'Outros';

export type SortBy =
  | 'date_desc'
  | 'date_asc'
  | 'value_desc'
  | 'value_asc'
  | 'name_asc'
  | 'name_desc';

export interface Purchase {
  id: number;
  productName: string;
  quantity: number;
  measurementUnit: MeasurementUnit;
  unitPrice: number;
  totalValue: number;
  purchaseDate: string;
  category: Category;
  purchaseLocation?: string | null;
  notes?: string | null;
  updatedAt?: string;
}

export interface PurchaseListParams {
  startDate?: string;
  endDate?: string;
  category?: string;
  minValue?: number;
  maxValue?: number;
  sortBy?: SortBy;
}

export interface CategoryTotal {
  category: Category;
  total: number;
}

export interface PurchaseListResponse {
  purchases: Purchase[];
  monthlyTotal: {
    value: number;
    period: string;
  };
  categoryTotals: CategoryTotal[];
}
