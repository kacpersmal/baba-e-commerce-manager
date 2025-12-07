import ProductListItem from './product-list-item'
import ProductListPagination from './product-list-pagination'
import { usePublicProducts } from './hooks'
import { useState } from 'react'

export default function ProductListContainer() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = usePublicProducts({
    page,
    limit,
    isActive: true,
  })

  if (isLoading) {
    return (
      <div className="min-h-[75vh] mx-auto my-15 flex items-center justify-center 2xl:w-[70%] w-[90%] p-2">
        <p className="text-gray-400">Ładowanie produktów...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[75vh] mx-auto my-15 flex items-center justify-center 2xl:w-[70%] w-[90%] p-2">
        <p className="text-red-500">Błąd podczas ładowania produktów</p>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[75vh] mx-auto my-15 flex flex-col gap-2 2xl:w-[70%] w-[90%] p-2">
        {data?.data.map((product: any) => (
          <ProductListItem key={product.id} productData={product} />
        ))}
        <ProductListPagination
          currentPage={page}
          totalPages={data?.meta.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </>
  )
}
