# Vertical Slice Architecture - Project Structure

This project now follows a vertical slice architecture where features are organized by business domain rather than technical layers.

## Structure Overview

```text
src/
├── features/                    # Feature-based organization (vertical slices)
│   ├── health/                 # Health monitoring feature
│   │   ├── HealthPage.tsx     # Health page component
│   │   ├── hooks.ts           # Health-specific API hooks
│   │   └── index.ts           # Public exports
│   ├── home/                   # Home page feature
│   │   ├── HomePage.tsx       # Home page component
│   │   └── index.ts           # Public exports
│   └── shared/                 # Shared/cross-cutting features
│       └── layout/             # Layout components
│           ├── Header.tsx     # Header component
│           └── index.ts       # Public exports
├── lib/                        # Infrastructure/technical concerns
│   ├── api/                    # API client infrastructure
│   │   ├── client.ts          # OpenAPI client setup
│   │   ├── hooks.ts           # Generic hook factories
│   │   ├── index.ts           # Public exports
│   │   ├── schema.ts          # Generated OpenAPI types
│   │   └── vite-plugin-openapi.ts
│   └── utils.ts               # Utility functions
├── integrations/               # Third-party integrations
│   └── tanstack-query/
├── routes/                     # TanStack Router routes
│   ├── __root.tsx
│   ├── index.tsx              # Routes import from features
│   └── health.tsx
└── ...

```

## Key Principles

### 1. Feature Organization

Each feature folder contains everything related to that business domain:

- UI components
- Business logic hooks
- Feature-specific types
- Tests (when added)

### 2. Infrastructure in lib/

The `lib/` folder contains technical infrastructure that's reusable across features:

- API client setup
- Generic hook factories (`createQueryHook`, `createMutationHook`)
- Utility functions
- Generated types

### 3. Routes as Entry Points

Route files are thin and simply import/wire up feature components:

```typescript
import { HealthPage } from '@/features/health'

export const Route = createFileRoute('/health')({
  component: HealthPage,
})
```

### 4. Shared Features

Cross-cutting concerns like layout components go in `features/shared/`:

- `features/shared/layout/` - Header, Footer, etc.
- Future: `features/shared/ui/` - Shared UI components
- Future: `features/shared/hooks/` - Shared custom hooks

## Benefits

✅ **Co-location**: Related code lives together

✅ **Clear boundaries**: Each feature is self-contained

✅ **Easy to find**: Look for feature name, not technical layer

✅ **Scalable**: New features don't affect existing ones

✅ **Testable**: Each feature can be tested in isolation

✅ **Infrastructure separation**: Technical concerns stay in lib/

## Adding New Features

1. Create feature folder: `src/features/your-feature/`
2. Add components, hooks, types in that folder
3. Export public API via `index.ts`
4. Create route that imports from feature
5. Feature-specific hooks use the generic factories from `lib/api/hooks.ts`

Example:

```typescript
// src/features/products/hooks.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/products')
      if (error) throw error
      return data
    },
  })
}
```
