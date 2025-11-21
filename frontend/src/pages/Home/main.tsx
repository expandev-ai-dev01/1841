import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';

function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
          Bem-vindo ao FoodTrack
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Gerencie suas compras de alimentos de forma simples e organizada. Mantenha o controle dos
          seus gastos e do histórico de compras.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Registro de Compras
            </CardTitle>
            <CardDescription>
              Adicione e gerencie seus registros de compras de alimentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Acessar Registros
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Controle de Gastos
            </CardTitle>
            <CardDescription>Acompanhe seus gastos mensais com alimentação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-primary-50 p-4">
              <p className="text-sm text-muted-foreground">Total do mês</p>
              <p className="text-2xl font-bold text-primary-600">R$ 0,00</p>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Histórico
            </CardTitle>
            <CardDescription>Visualize o histórico completo de compras</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Ver Histórico
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-lg border bg-muted/50 p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold">Comece Agora</h3>
        <p className="mb-4 text-muted-foreground">
          Adicione seu primeiro registro de compra e comece a controlar seus gastos
        </p>
        <Button size="lg">Adicionar Primeira Compra</Button>
      </section>
    </div>
  );
}

export { HomePage };
