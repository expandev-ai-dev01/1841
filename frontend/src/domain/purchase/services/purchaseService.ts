import { authenticatedClient } from '@/core/lib/api';
import type { Purchase, PurchaseListParams, PurchaseListResponse } from '../types/purchase';
import type { PurchaseFormData } from '../types/forms';

export const purchaseService = {
  async list(params?: PurchaseListParams): Promise<PurchaseListResponse> {
    const { data } = await authenticatedClient.get('/purchase', { params });
    return data.data;
  },

  async getById(id: number): Promise<Purchase> {
    const { data } = await authenticatedClient.get(`/purchase/${id}`);
    return data.data;
  },

  async create(formData: PurchaseFormData): Promise<Purchase> {
    const { data } = await authenticatedClient.post('/purchase', formData);
    return data.data;
  },

  async update(id: number, formData: PurchaseFormData): Promise<Purchase> {
    const { data } = await authenticatedClient.put(`/purchase/${id}`, formData);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await authenticatedClient.delete(`/purchase/${id}`);
  },
};
