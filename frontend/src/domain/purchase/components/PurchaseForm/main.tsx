import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { usePurchaseForm } from '../../hooks/usePurchaseForm';
import type { Purchase } from '../../types/purchase';
import type { PurchaseFormData } from '../../types/forms';
import { formatCurrency } from '@/core/utils/date';

interface PurchaseFormProps {
  purchase?: Purchase;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

function PurchaseForm({ purchase, onSubmit, onCancel, isSubmitting }: PurchaseFormProps) {
  const { form, handleSubmit, totalValue } = usePurchaseForm({
    defaultValues: purchase,
    onSubmit,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{purchase ? 'Editar Compra' : 'Nova Compra'}</CardTitle>
        <CardDescription>
          {purchase ? 'Atualize as informações da compra' : 'Preencha os dados da compra'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="productName">Nome do Produto *</Label>
              <Input
                id="productName"
                {...register('productName')}
                placeholder="Ex: Arroz Integral"
              />
              {errors.productName && (
                <p className="text-sm text-destructive">{errors.productName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <select
                id="category"
                {...register('category')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Frutas">Frutas</option>
                <option value="Verduras">Verduras</option>
                <option value="Carnes">Carnes</option>
                <option value="Laticínios">Laticínios</option>
                <option value="Grãos">Grãos</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Congelados">Congelados</option>
                <option value="Padaria">Padaria</option>
                <option value="Outros">Outros</option>
              </select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                {...register('quantity', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurementUnit">Unidade de Medida *</Label>
              <select
                id="measurementUnit"
                {...register('measurementUnit')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="kg">Quilograma (kg)</option>
                <option value="g">Grama (g)</option>
                <option value="l">Litro (l)</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="unidade">Unidade</option>
                <option value="pacote">Pacote</option>
                <option value="caixa">Caixa</option>
                <option value="duzia">Dúzia</option>
              </select>
              {errors.measurementUnit && (
                <p className="text-sm text-destructive">{errors.measurementUnit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Preço Unitário *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                {...register('unitPrice', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.unitPrice && (
                <p className="text-sm text-destructive">{errors.unitPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Data da Compra *</Label>
              <Input id="purchaseDate" {...register('purchaseDate')} placeholder="DD/MM/AAAA" />
              {errors.purchaseDate && (
                <p className="text-sm text-destructive">{errors.purchaseDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseLocation">Local da Compra</Label>
              <Input
                id="purchaseLocation"
                {...register('purchaseLocation')}
                placeholder="Ex: Supermercado ABC"
              />
              {errors.purchaseLocation && (
                <p className="text-sm text-destructive">{errors.purchaseLocation.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                {...register('notes')}
                placeholder="Observações adicionais sobre a compra"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
            </div>
          </div>

          <div className="rounded-lg border bg-primary-50 p-4">
            <p className="text-sm text-muted-foreground">Valor Total</p>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalValue || 0)}</p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Salvando...' : purchase ? 'Atualizar' : 'Cadastrar'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export { PurchaseForm };
