import ProductDescription from './product-description'
import ProductOptions from './product-options'
import ProductReviews from './product-reviews'
import { useProductBySlug } from './hooks'

type ProductContainerProps = {
  slug?: string
}

export default function ProductContainer({ slug }: ProductContainerProps) {
  const { data: product, isLoading, error } = useProductBySlug(slug || '')

  if (!slug) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <p className="text-gray-400">Nie wybrano produktu</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <p className="text-gray-400">Ładowanie...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <p className="text-red-500">Nie znaleziono produktu</p>
      </div>
    )
  }

  return (
    <>
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-background -z-10" />
      <div className="felx flex-col min-h-[85vh] pt-10 px-20 ">
        <div className=" w-full flex p-2 gap-4">
          <div className="w-2/3  h-96 rounded-xl ">
            <img
              src={product.imageUrl || '/macw2.jpg'}
              alt={product.name}
              className="object-cover object-center w-full h-full rounded-xl"
            />
          </div>
          <div className="w-1/3 h-96 rounded-xl flex flex-col gap-4">
            {/* carousel later */}
            <div className=" h-46 rounded-xl  ">
              <img
                src={product.imageUrl || '/macw1.jpg'}
                alt={product.name}
                className="object-cover object-center w-full h-full rounded-xl"
              />
            </div>
            <div className=" h-46 rounded-xl  ">
              <img
                src={product.imageUrl || '/macw3.jpg'}
                alt={product.name}
                className="object-cover object-center w-full h-full rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full min-h-96 p-2 gap-4 ">
          <div className="w-2/3  min-h-96  p-2">
            <ProductDescription product={product} />
          </div>
          <div className="w-1/3  min-h-96 rounded-md border p-5">
            <ProductOptions product={product} />
          </div>
        </div>
        <div className="w-full p-2">
          <ProductReviews />
        </div>
      </div>
    </>
  )
}
