import { Button } from '@/core/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useNavigation } from '@/core/hooks/useNavigation';

function NotFoundPage() {
  const { goHome } = useNavigation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-6xl">🔍</div>
          <CardTitle className="text-4xl">404</CardTitle>
          <CardDescription className="text-lg">Página não encontrada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Button onClick={goHome} className="w-full">
            Voltar para Início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export { NotFoundPage };
