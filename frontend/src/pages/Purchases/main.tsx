import { useState } from 'react';
import { Button } from '@/core/components/button';
import { PurchaseForm } from '@/domain/purchase/components/PurchaseForm';
import { PurchaseList } from '@/domain/purchase/components/PurchaseList';
import { PurchaseFilters } from '@/domain/purchase/components/PurchaseFilters';
import { MonthlyTotal } from '@/domain/purchase/components/MonthlyTotal';
import { DeleteConfirmDialog } from '@/domain/purchase/components/DeleteConfirmDialog';
import { usePurchaseList } from '@/domain/purchase/hooks/usePurchaseList';
import type { Purchase, PurchaseListParams } from '@/domain/purchase/types/purchase';
import type { PurchaseFormData } from '@/domain/purchase/types/forms';

function PurchasesPage() {
  const [filters, setFilters] = useState<PurchaseListParams | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | undefined>(undefined);
  const [deletingPurchase, setDeletingPurchase] = useState<Purchase | undefined>(undefined);

  const {
    purchases,
    monthlyTotal,
    categoryTotals,
    isLoading,
    create,
    update,
    delete: deletePurchase,
    isCreating,
    isUpdating,
    isDeleting,
  } = usePurchaseList(filters);

  const handleCreateSubmit = async (data: PurchaseFormData) => {
    await create(data);
    setShowForm(false);
  };

  const handleUpdateSubmit = async (data: PurchaseFormData) => {
    if (editingPurchase) {
      await update({ id: editingPurchase.id, formData: data });
      setEditingPurchase(undefined);
    }
  };

  const handleDelete = async () => {
    if (deletingPurchase) {
      await deletePurchase(deletingPurchase.id);
      setDeletingPurchase(undefined);
    }
  };

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPurchase(undefined);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Compras</h1>
          <p className="text-muted-foreground">Gerencie suas compras de alimentos</p>
        </div>
        {!showForm && !editingPurchase && (
          <Button onClick={() => setShowForm(true)}>Nova Compra</Button>
        )}
      </div>

      {monthlyTotal && (
        <MonthlyTotal
          value={monthlyTotal.value}
          period={monthlyTotal.period}
          categoryTotals={categoryTotals}
        />
      )}

      {showForm && (
        <PurchaseForm
          onSubmit={handleCreateSubmit}
          onCancel={handleCancelForm}
          isSubmitting={isCreating}
        />
      )}

      {editingPurchase && (
        <PurchaseForm
          purchase={editingPurchase}
          onSubmit={handleUpdateSubmit}
          onCancel={handleCancelForm}
          isSubmitting={isUpdating}
        />
      )}

      {!showForm && !editingPurchase && (
        <>
          <PurchaseFilters onFilter={setFilters} onClear={() => setFilters(undefined)} />

          <PurchaseList
            purchases={purchases}
            onEdit={handleEdit}
            onDelete={setDeletingPurchase}
            isLoading={isLoading}
          />
        </>
      )}

      {deletingPurchase && (
        <DeleteConfirmDialog
          purchase={deletingPurchase}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPurchase(undefined)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export { PurchasesPage };
