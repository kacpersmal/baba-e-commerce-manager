import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CategoryForm } from '../category-form'
import type { components } from '@/lib/api/schema'

type CategoryResponse = components['schemas']['CategoryResponseDto']
type UpdateCategoryDto = components['schemas']['UpdateCategoryDto']

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryResponse | null
  categories: CategoryResponse[]
  onSubmit: (data: UpdateCategoryDto) => void
  isPending: boolean
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  categories,
  onSubmit,
  isPending,
}: EditCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update category information</DialogDescription>
        </DialogHeader>
        {category && (
          <CategoryForm
            category={category}
            categories={categories}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
