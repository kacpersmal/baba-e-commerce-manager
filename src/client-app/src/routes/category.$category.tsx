// src/routes/category.$category.tsx

import { createFileRoute, Link } from '@tanstack/react-router'
import { useCategoryBySlug } from '@/features/navbar/hooks'

export const Route = createFileRoute('/category/$category')({
  component: CategoryPage,
})

function CategoryPage() {
  const { category } = Route.useParams()
  const { data: current, isLoading, isError } = useCategoryBySlug(category)

  if (isLoading) {
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

      {current.children && current.children.length > 0 ? (
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
      ) : (
        <p className="text-gray-500">Brak podkategorii</p>
      )}
    </div>
  )
}
