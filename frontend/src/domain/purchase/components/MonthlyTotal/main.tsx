import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { formatCurrency } from '@/core/utils/date';
import type { CategoryTotal } from '../../types/purchase';

interface MonthlyTotalProps {
  value: number;
  period: string;
  categoryTotals?: CategoryTotal[];
}

function MonthlyTotal({ value, period, categoryTotals }: MonthlyTotalProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-primary-200 bg-primary-50">
        <CardHeader>
          <CardTitle className="text-primary-700">Total do Período</CardTitle>
          <CardDescription>{period}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary-600">{formatCurrency(value)}</p>
        </CardContent>
      </Card>

      {categoryTotals && categoryTotals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Total por Categoria</CardTitle>
            <CardDescription>Distribuição dos gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryTotals.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
                >
                  <span className="font-medium">{item.category}</span>
                  <span className="font-bold text-primary-600">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { MonthlyTotal };
