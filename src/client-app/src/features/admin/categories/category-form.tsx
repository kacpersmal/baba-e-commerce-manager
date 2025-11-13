import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CategorySelector } from './category-selector'
import { IconSelector } from './icon-selector'
import { ColorSelector } from './color-selector'
import type { components } from '@/lib/api/schema'

type CategoryResponse = components['schemas']['CategoryResponseDto']
type CreateCategoryDto = components['schemas']['CreateCategoryDto']
type UpdateCategoryDto = components['schemas']['UpdateCategoryDto']

interface CategoryFormProps {
  category?: CategoryResponse
  categories: CategoryResponse[]
  onSubmit: (data: CreateCategoryDto & UpdateCategoryDto) => void
  onCancel: () => void
  isLoading?: boolean
}

interface FormData {
  name: string
  slug: string
  icon?: string
  color?: string
  order?: number
  parentId?: string
}

export function CategoryForm({
  category,
  categories,
  onSubmit,
  onCancel,
  isLoading,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      icon: category?.icon || '',
      color: category?.color || '',
      order: category?.order || 0,
      parentId: category?.parentId || '',
    },
  })

  const watchName = watch('name')
  const watchParentId = watch('parentId')
  const watchIcon = watch('icon')
  const watchColor = watch('color')

  // Auto-generate slug from name
  useEffect(() => {
    if (!category && watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setValue('slug', slug)
    }
  }, [watchName, category, setValue])

  const handleFormSubmit = (data: FormData) => {
    const formData = {
      ...data,
      parentId: data.parentId || undefined,
      icon: data.icon || undefined,
      color: data.color || undefined,
      order: data.order || 0,
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="e.g., Electronics"
          className="h-9"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug" className="text-sm font-medium">
          Slug <span className="text-destructive">*</span>
        </Label>
        <Input
          id="slug"
          {...register('slug', { required: 'Slug is required' })}
          placeholder="e.g., electronics"
          className="h-9"
        />
        {errors.slug && (
          <p className="text-xs text-destructive">{errors.slug.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId" className="text-sm font-medium">
          Parent Category
        </Label>
        <CategorySelector
          categories={categories}
          value={watchParentId || ''}
          onChange={(value) => setValue('parentId', value)}
          excludeId={category?.id}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon" className="text-sm font-medium">
            Icon
          </Label>
          <IconSelector
            value={watchIcon}
            onChange={(value) => setValue('icon', value)}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">Lucide icon name</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order" className="text-sm font-medium">
            Order
          </Label>
          <Input
            id="order"
            type="number"
            {...register('order', { valueAsNumber: true })}
            placeholder="0"
            className="h-9"
          />
          <p className="text-xs text-muted-foreground">Display order</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color" className="text-sm font-medium">
          Color (Tailwind)
        </Label>
        <ColorSelector
          value={watchColor}
          onChange={(value) => setValue('color', value)}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Optional Tailwind color class
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
