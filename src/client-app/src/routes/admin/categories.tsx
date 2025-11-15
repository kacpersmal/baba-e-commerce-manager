import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageHeader } from '@/features/admin/shared/components/page-header'
import { DeleteConfirmDialog } from '@/features/admin/shared/components/delete-confirm-dialog'
import { CategoryTreePanel } from '@/features/admin/categories/components/category-tree-panel'
import { CategoryDetailsPanel } from '@/features/admin/categories/components/category-details-panel'
import { CreateCategoryDialog } from '@/features/admin/categories/components/create-category-dialog'
import { EditCategoryDialog } from '@/features/admin/categories/components/edit-category-dialog'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/admin/categories/hooks'
import type { components } from '@/lib/api/schema'
import { toast } from 'sonner'

type CategoryResponse = components['schemas']['CategoryResponseDto']
type CreateCategoryDto = components['schemas']['CreateCategoryDto']
type UpdateCategoryDto = components['schemas']['UpdateCategoryDto']

export const Route = createFileRoute('/admin/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryResponse | null>(
    null,
  )
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: categories, isLoading, error } = useCategories()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!categories || !searchQuery) return categories || []

    const matchesSearch = (cat: CategoryResponse, query: string): boolean => {
      const lowerQuery = query.toLowerCase()
      const matches =
        cat.name.toLowerCase().includes(lowerQuery) ||
        cat.slug.toLowerCase().includes(lowerQuery)

      if (matches) return true

      if (cat.children) {
        return cat.children.some((child) => matchesSearch(child, query))
      }

      return false
    }

    const filterTree = (cats: CategoryResponse[]): CategoryResponse[] => {
      return cats
        .filter((cat) => matchesSearch(cat, searchQuery))
        .map((cat) => ({
          ...cat,
          children: cat.children ? filterTree(cat.children) : undefined,
        }))
    }

    return filterTree(categories)
  }, [categories, searchQuery])

  const handleCreate = (data: CreateCategoryDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Category created successfully')
        setIsCreateDialogOpen(false)
      },
      onError: (error) => {
        toast.error(`Failed to create category: ${error.message}`)
      },
    })
  }

  const handleUpdate = (data: UpdateCategoryDto) => {
    if (!categoryToEdit) return

    updateMutation.mutate(
      { id: categoryToEdit.id, data },
      {
        onSuccess: () => {
          toast.success('Category updated successfully')
          setIsEditDialogOpen(false)
          setCategoryToEdit(null)
          if (selectedCategory?.id === categoryToEdit.id) {
            setSelectedCategory(null)
          }
        },
        onError: (error) => {
          toast.error(`Failed to update category: ${error.message}`)
        },
      },
    )
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    deleteMutation.mutate(categoryToDelete.id, {
      onSuccess: () => {
        toast.success('Category deleted successfully')
        setIsDeleteDialogOpen(false)
        setCategoryToDelete(null)
        if (selectedCategory?.id === categoryToDelete.id) {
          setSelectedCategory(null)
        }
      },
      onError: (error) => {
        toast.error(`Failed to delete category: ${error.message}`)
      },
    })
  }

  const handleEdit = (category: CategoryResponse) => {
    setCategoryToEdit(category)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (category: CategoryResponse) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load categories: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-7xl">
      <PageHeader
        title="Category Management"
        description="Manage your product categories and hierarchy"
        actionLabel="Add Category"
        onAction={() => setIsCreateDialogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategoryTreePanel
          categories={categories || []}
          filteredCategories={filteredCategories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedId={selectedCategory?.id}
          onSelect={setSelectedCategory}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <CategoryDetailsPanel
          category={selectedCategory}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        categories={categories || []}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      <EditCategoryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={categoryToEdit}
        categories={categories || []}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
