import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { PurchaseListParams } from '../../types/purchase';
import type { PurchaseFormData } from '../../types/forms';

export const usePurchaseList = (params?: PurchaseListParams) => {
  const queryClient = useQueryClient();
  const queryKey = ['purchases', params];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => purchaseService.list(params),
  });

  const createMutation = useMutation({
    mutationFn: (formData: PurchaseFormData) => purchaseService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: PurchaseFormData }) =>
      purchaseService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => purchaseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  return {
    purchases: data?.purchases ?? [],
    monthlyTotal: data?.monthlyTotal,
    categoryTotals: data?.categoryTotals ?? [],
    isLoading,
    error,
    refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
