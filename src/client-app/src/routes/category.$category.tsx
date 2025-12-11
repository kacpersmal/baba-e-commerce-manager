// src/routes/category.$category.tsx

import { createFileRoute, Link } from '@tanstack/react-router'
import { useCategoryBySlug } from '@/features/navbar/hooks'
import { usePublicProducts } from '@/features/product-list/hooks'
import ProductListItem from '@/features/product-list/product-list-item'
import ProductListPagination from '@/features/product-list/product-list-pagination'
import { useState } from 'react'

export const Route = createFileRoute('/category/$category')({
  component: CategoryPage,
})

function CategoryPage() {
  const { category } = Route.useParams()
  const {
    data: current,
    isLoading: categoryLoading,
    isError,
  } = useCategoryBySlug(category)
  const [page, setPage] = useState(1)
  const limit = 10

  const { data: productsData, isLoading: productsLoading } = usePublicProducts({
    page,
    limit,
    category: current?.name,
    isActive: true,
  })

  if (categoryLoading) {
    return <div className="container mx-auto py-10 text-xl">Ładowanie...</div>
  }

  if (isError || !current) {
    return (
      <div className="container mx-auto py-10 text-xl">
        Kategoria nie istnieje.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">{current.name}</h1>

      {current.children && current.children.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Podkategorie</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {current.children.map((item) => (
              <li key={item.id}>
                <Link
                  to="/category/$category"
                  params={{ category: item.slug }}
                  className="block border rounded px-4 py-3 hover:bg-orange-500/10 hover:text-orange-600 transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Produkty</h2>
        {productsLoading ? (
          <p className="text-gray-400">Ładowanie produktów...</p>
        ) : productsData?.data && productsData.data.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              {productsData.data.map((product: any) => (
                <ProductListItem key={product.id} productData={product} />
              ))}
            </div>
            {productsData.meta && productsData.meta.totalPages > 1 && (
              <div className="mt-4">
                <ProductListPagination
                  currentPage={page}
                  totalPages={productsData.meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">Brak produktów w tej kategorii</p>
        )}
      </div>
    </div>
  )
}
