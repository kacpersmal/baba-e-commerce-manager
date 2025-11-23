import { createFileRoute } from '@tanstack/react-router'
import ProductContainer from '@/features/product/product-container'
export const Route = createFileRoute('/product')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center w-[90%] 2xl:w-[70%] mx-auto h-full">
      <ProductContainer />
    </div>
  )
}
