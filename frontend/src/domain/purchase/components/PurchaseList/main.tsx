import { Card, CardContent } from '@/core/components/card';
import { Button } from '@/core/components/button';
import type { Purchase } from '../../types/purchase';
import { formatDate, formatCurrency } from '@/core/utils/date';

interface PurchaseListProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchase: Purchase) => void;
  isLoading?: boolean;
}

function PurchaseList({ purchases, onEdit, onDelete, isLoading }: PurchaseListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-3/4 rounded bg-muted"></div>
                <div className="h-4 w-1/2 rounded bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 text-6xl">🛒</div>
          <p className="text-lg font-medium text-muted-foreground">Nenhuma compra encontrada</p>
          <p className="text-sm text-muted-foreground">Adicione sua primeira compra para começar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{purchase.productName}</h3>
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                    {purchase.category}
                  </span>
                </div>

                <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                  <div>
                    <span className="font-medium">Quantidade:</span> {purchase.quantity}{' '}
                    {purchase.measurementUnit}
                  </div>
                  <div>
                    <span className="font-medium">Preço Unitário:</span>{' '}
                    {formatCurrency(purchase.unitPrice)}
                  </div>
                  <div>
                    <span className="font-medium">Data:</span> {formatDate(purchase.purchaseDate)}
                  </div>
                  {purchase.purchaseLocation && (
                    <div>
                      <span className="font-medium">Local:</span> {purchase.purchaseLocation}
                    </div>
                  )}
                </div>

                {purchase.notes && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Obs:</span> {purchase.notes}
                  </p>
                )}

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold text-primary-600">
                    {formatCurrency(purchase.totalValue)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(purchase)}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(purchase)}>
                  Excluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { PurchaseList };
