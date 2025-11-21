import { ErrorBoundary } from '@/router/error-boundary';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/core/components/loading-spinner';

function MainLayout() {
  const { location } = useNavigation();

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
        <header className="border-b bg-card px-6 py-4 shadow-sm">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-primary-600">FoodTrack</h1>
            <p className="text-sm text-muted-foreground">Controle de Compras de Alimentos</p>
          </div>
        </header>

        <main className="flex flex-1">
          <div className="container mx-auto flex-1 px-6 py-8">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <LoadingSpinner />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>

        <footer className="border-t bg-card px-6 py-4">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FoodTrack. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export { MainLayout };
