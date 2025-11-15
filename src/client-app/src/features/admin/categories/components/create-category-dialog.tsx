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
type CreateCategoryDto = components['schemas']['CreateCategoryDto']

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CategoryResponse[]
  onSubmit: (data: CreateCategoryDto) => void
  isPending: boolean
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  categories,
  onSubmit,
  isPending,
}: CreateCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category to your product catalog
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          categories={categories}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
