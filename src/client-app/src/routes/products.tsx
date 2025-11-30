import ProductListContainer from '@/features/product-list/product-list-container'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-background -z-10" />
      <ProductListContainer />
    </div>
  )
}
