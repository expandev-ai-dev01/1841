# FoodTrack - Frontend

## Descrição

Frontend do FoodTrack, um sistema de controle de compras de alimentos desenvolvido com React, TypeScript e TailwindCSS.

## Tecnologias

- **React 19.2.0** - Biblioteca UI
- **TypeScript 5.9.3** - Tipagem estática
- **Vite 7.2.2** - Build tool
- **TailwindCSS 4.1.17** - Framework CSS
- **React Router 7.9.6** - Roteamento
- **TanStack Query 5.90.2** - Gerenciamento de estado servidor
- **Zustand 5.0.8** - Gerenciamento de estado cliente
- **React Hook Form 7.66.1** - Gerenciamento de formulários
- **Zod 4.1.12** - Validação de schemas
- **Axios 1.13.2** - Cliente HTTP
- **date-fns 4.1.0** - Manipulação de datas

## Estrutura do Projeto

```
src/
├── assets/          # Estilos globais e assets
├── core/            # Componentes e utilitários compartilhados
│   ├── components/  # Componentes UI genéricos
│   ├── hooks/       # Hooks customizados
│   ├── lib/         # Configurações de bibliotecas
│   ├── stores/      # Stores globais (Zustand)
│   └── utils/       # Funções utilitárias
├── domain/          # Domínios de negócio (features)
├── layouts/         # Layouts da aplicação
├── pages/           # Páginas/rotas
├── router/          # Configuração de rotas
├── App.tsx          # Componente raiz
└── main.tsx         # Entry point
```

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:5000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint

# Formatação de código
npm run format
```

## Padrões de Desenvolvimento

### Componentes

- Componentes genéricos em `src/core/components` (single-file pattern)
- Componentes de domínio em `src/domain/[domain]/components` (module pattern)
- Sempre usar TypeScript com tipagem estrita
- Usar `cn()` para merge de classes Tailwind

### Estado

- **Estado Global**: Zustand (`src/core/stores`)
- **Estado Servidor**: TanStack Query
- **Estado Local**: useState/useReducer

### Formulários

- React Hook Form + Zod para validação
- Sempre usar `z.infer<typeof schema>` para tipos
- Sanitização com DOMPurify antes de submissão

### API

- `publicClient` para endpoints públicos
- `authenticatedClient` para endpoints autenticados
- Configuração em `src/core/lib/api.ts`

### Roteamento

- Lazy loading obrigatório para páginas
- ErrorBoundary em layouts
- Suspense com LoadingSpinner

## Convenções de Código

- **Imports**: Usar path alias `@/` para imports absolutos
- **Naming**: PascalCase para componentes, camelCase para funções
- **Files**: kebab-case para arquivos, PascalCase para componentes
- **Exports**: Named exports, não default exports (exceto páginas lazy)

## Acessibilidade

- Usar tags semânticas HTML5
- Sempre fornecer `alt` em imagens
- Garantir navegação por teclado
- Estados de foco visíveis
- ARIA attributes quando necessário

## Contribuição

1. Siga a estrutura de pastas definida
2. Mantenha consistência com os padrões estabelecidos
3. Documente componentes complexos
4. Teste responsividade (mobile-first)
5. Valide acessibilidade

## Licença

MIT