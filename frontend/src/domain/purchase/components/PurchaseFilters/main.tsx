import { Card, CardContent } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { useState } from 'react';
import type { PurchaseListParams } from '../../types/purchase';

interface PurchaseFiltersProps {
  onFilter: (params: PurchaseListParams) => void;
  onClear: () => void;
}

function PurchaseFilters({ onFilter, onClear }: PurchaseFiltersProps) {
  const [filters, setFilters] = useState<PurchaseListParams>({
    startDate: '',
    endDate: '',
    category: '',
    minValue: undefined,
    maxValue: undefined,
    sortBy: 'date_desc',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFilters: PurchaseListParams = {};

    if (filters.startDate) cleanFilters.startDate = filters.startDate;
    if (filters.endDate) cleanFilters.endDate = filters.endDate;
    if (filters.category) cleanFilters.category = filters.category;
    if (filters.minValue !== undefined) cleanFilters.minValue = filters.minValue;
    if (filters.maxValue !== undefined) cleanFilters.maxValue = filters.maxValue;
    if (filters.sortBy) cleanFilters.sortBy = filters.sortBy;

    onFilter(cleanFilters);
  };

  const handleClear = () => {
    setFilters({
      startDate: '',
      endDate: '',
      category: '',
      minValue: undefined,
      maxValue: undefined,
      sortBy: 'date_desc',
    });
    onClear();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Todas</option>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="minValue">Valor Mínimo</Label>
              <Input
                id="minValue"
                type="number"
                step="0.01"
                value={filters.minValue ?? ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minValue: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxValue">Valor Máximo</Label>
              <Input
                id="maxValue"
                type="number"
                step="0.01"
                value={filters.maxValue ?? ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxValue: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortBy">Ordenar Por</Label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="date_desc">Data (mais recente)</option>
                <option value="date_asc">Data (mais antiga)</option>
                <option value="value_desc">Valor (maior)</option>
                <option value="value_asc">Valor (menor)</option>
                <option value="name_asc">Nome (A-Z)</option>
                <option value="name_desc">Nome (Z-A)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Aplicar Filtros
            </Button>
            <Button type="button" variant="outline" onClick={handleClear}>
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export { PurchaseFilters };
