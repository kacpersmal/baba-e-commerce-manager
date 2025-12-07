import { createFileRoute } from '@tanstack/react-router'
import ProductContainer from '@/features/product/product-container'

type ProductSearch = {
  slug?: string
}

export const Route = createFileRoute('/product')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      slug: (search.slug as string) || undefined,
    }
  },
})

function RouteComponent() {
  const { slug } = Route.useSearch()

  return (
    <div className="flex items-center w-[90%] 2xl:w-[70%] mx-auto h-full">
      <ProductContainer slug={slug} />
    </div>
  )
}
