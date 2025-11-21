import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import type { Purchase } from '../../types/purchase';
import { formatCurrency, formatDate } from '@/core/utils/date';

interface DeleteConfirmDialogProps {
  purchase: Purchase;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

function DeleteConfirmDialog({
  purchase,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Confirmar Exclusão</CardTitle>
          <CardDescription>Esta ação não pode ser desfeita.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted p-4">
            <p className="mb-2 font-semibold">{purchase.productName}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Categoria:</span> {purchase.category}
              </p>
              <p>
                <span className="font-medium">Data:</span> {formatDate(purchase.purchaseDate)}
              </p>
              <p>
                <span className="font-medium">Valor:</span> {formatCurrency(purchase.totalValue)}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita e o valor
            será removido dos totais mensais.
          </p>

          <div className="flex gap-4">
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { DeleteConfirmDialog };
