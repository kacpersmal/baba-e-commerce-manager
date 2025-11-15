import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryTree } from '../category-tree'
import { SearchInput } from '@/features/admin/shared/components/search-input'
import type { components } from '@/lib/api/schema'

type CategoryResponse = components['schemas']['CategoryResponseDto']

interface CategoryTreePanelProps {
  categories: CategoryResponse[]
  filteredCategories: CategoryResponse[]
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedId?: string
  onSelect: (category: CategoryResponse) => void
  onEdit: (category: CategoryResponse) => void
  onDelete: (category: CategoryResponse) => void
}

export function CategoryTreePanel({
  categories,
  filteredCategories,
  searchQuery,
  onSearchChange,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: CategoryTreePanelProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="space-y-3">
        <CardTitle className="text-base font-semibold">Category Tree</CardTitle>
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search categories..."
        />
      </CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          filteredCategories.length > 0 ? (
            <div className="max-h-[600px] overflow-y-auto pr-2">
              <CategoryTree
                categories={filteredCategories}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                selectedId={selectedId}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-muted-foreground">
              No categories found matching "{searchQuery}"
            </div>
          )
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No categories yet. Create your first category to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
