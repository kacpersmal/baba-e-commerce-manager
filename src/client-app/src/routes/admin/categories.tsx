import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Plus, Loader2, AlertCircle, Search, FolderOpen } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CategoryTree } from '@/features/admin/categories/category-tree'
import { CategoryForm } from '@/features/admin/categories/category-form'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/admin/categories/hooks'
import type { components } from '@/lib/api/schema'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

  const handleDelete = () => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product categories and hierarchy
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree View */}
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-3">
            <CardTitle className="text-base font-semibold">
              Category Tree
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {categories && categories.length > 0 ? (
              filteredCategories.length > 0 ? (
                <div className="max-h-[600px] overflow-y-auto pr-2">
                  <CategoryTree
                    categories={filteredCategories}
                    onSelect={setSelectedCategory}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    selectedId={selectedCategory?.id}
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

        {/* Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Category Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedCategory.name}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Slug
                  </p>
                  <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm block">
                    {selectedCategory.slug}
                  </code>
                </div>

                {selectedCategory.icon && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      Icon
                    </p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const IconComponent = LucideIcons[
                          selectedCategory.icon as keyof typeof LucideIcons
                        ] as React.ComponentType<{ className?: string }>
                        return IconComponent &&
                          typeof IconComponent !== 'string' ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded border bg-muted">
                            <IconComponent className="h-5 w-5" />
                          </div>
                        ) : null
                      })()}
                      <code className="relative rounded bg-muted px-2 py-[0.3rem] font-mono text-sm">
                        {selectedCategory.icon}
                      </code>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      Order
                    </p>
                    <p className="text-sm font-medium">
                      {selectedCategory.order}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      Created
                    </p>
                    <p className="text-sm">
                      {new Date(
                        selectedCategory.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedCategory.parentId && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      Parent ID
                    </p>
                    <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-xs block break-all">
                      {selectedCategory.parentId}
                    </code>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleEdit(selectedCategory)}
                    className="flex-1"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(selectedCategory)}
                    variant="destructive"
                    className="flex-1"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Select a category to view details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to your product catalog
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            categories={categories || []}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          {categoryToEdit && (
            <CategoryForm
              category={categoryToEdit}
              categories={categories || []}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setCategoryToEdit(null)
              }}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setCategoryToDelete(null)
              }}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
