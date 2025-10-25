# Modern Patterns Quick Reference

## Component Structure

### Use shadcn/ui Components

```typescript
// ✅ Modern: Use shadcn components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function MyFeature() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Action</Button>
        <Badge variant="default">Status</Badge>
      </CardContent>
    </Card>
  )
}

// ❌ Old: Direct Tailwind styling
export function OldFeature() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Feature Title</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Action
      </button>
    </div>
  )
}
```

## Layout Patterns

### Container & Spacing

```typescript
// ✅ Use container and semantic spacing
export function Page() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Title</h1>
        <p className="text-muted-foreground">Subtitle</p>
      </div>
      <Separator />
      {/* Content */}
    </div>
  )
}
```

### Grid Layouts

```typescript
// ✅ Responsive grid with shadcn Cards
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>{item.content}</CardContent>
    </Card>
  ))}
</div>
```

## Loading States

```typescript
// ✅ Use Skeleton component
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}
```

## Error States

```typescript
// ✅ Use Alert component
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export function ErrorState({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}
```

## Status Badges

```typescript
// ✅ Use Badge variants
import { Badge } from '@/components/ui/badge'

export function StatusIndicator({ status }: { status: string }) {
  const variant = status === 'success' ? 'default' : 'destructive'
  return <Badge variant={variant}>{status}</Badge>
}
```

## Icons

```typescript
// ✅ Use lucide-react icons
import { Package, Activity, ArrowRight, CheckCircle2 } from 'lucide-react'

export function IconExample() {
  return (
    <div className="flex items-center gap-2">
      <Package className="h-5 w-5" />
      <span>Icon with text</span>
    </div>
  )
}
```

## Data Display

```typescript
// ✅ Code/JSON display with proper styling
<pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
  {JSON.stringify(data, null, 2)}
</pre>

// For inline code
<code className="rounded-md bg-muted px-2 py-1 text-sm font-mono">
  npm run dev
</code>
```

## Typography

```typescript
// ✅ Use semantic classes
<h1 className="text-4xl font-bold tracking-tight">Main Heading</h1>
<h2 className="text-2xl font-semibold">Section Heading</h2>
<p className="text-muted-foreground">Secondary text</p>
<p className="text-sm">Small text</p>
```

## Button Variants

```typescript
import { Button } from '@/components/ui/button'

// Primary action
<Button>Primary</Button>

// Secondary action
<Button variant="outline">Secondary</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// With icon
<Button className="gap-2">
  <ArrowRight className="h-4 w-4" />
  Next
</Button>

// Size variants
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

## Component Export Pattern

```typescript
// ✅ Always use named exports
export function FeatureComponent() {}

// ✅ Create index.ts for public API
// features/my-feature/index.ts
export { FeatureComponent } from './FeatureComponent'
export { useFeatureData } from './hooks'

// ❌ Avoid default exports
export default FeatureComponent
```

## API Hooks Pattern

```typescript
// ✅ Feature-specific hooks in features/
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useFeatureData() {
  return useQuery({
    queryKey: ['feature-data'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/feature')
      if (error) throw error
      return data
    },
  })
}
```

## Color Usage

```typescript
// ✅ Use semantic color classes
className = 'text-muted-foreground'
className = 'bg-primary'
className = 'border-destructive'

// ❌ Avoid specific color values
className = 'text-gray-600'
className = 'bg-blue-500'
```

## Responsive Design

```typescript
// ✅ Mobile-first responsive classes
<div className="flex flex-col sm:flex-row gap-4">
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
<div className="text-sm sm:text-base lg:text-lg">
```

## Accessibility

```typescript
// ✅ shadcn components are accessible by default
// Add ARIA labels when needed
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Use semantic HTML
<nav>
  <NavigationMenu>
    {/* Navigation items */}
  </NavigationMenu>
</nav>
```
