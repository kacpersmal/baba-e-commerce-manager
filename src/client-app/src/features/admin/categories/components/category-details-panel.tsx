import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderOpen } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { components } from '@/lib/api/schema'

type CategoryResponse = components['schemas']['CategoryResponseDto']

interface CategoryDetailsPanelProps {
  category: CategoryResponse | null
  onEdit: (category: CategoryResponse) => void
  onDelete: (category: CategoryResponse) => void
}

export function CategoryDetailsPanel({
  category,
  onEdit,
  onDelete,
}: CategoryDetailsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Category Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {category ? (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{category.name}</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Slug</p>
              <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm block">
                {category.slug}
              </code>
            </div>

            {category.icon && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Icon
                </p>
                <div className="flex items-center gap-2">
                  {(() => {
                    const IconComponent = LucideIcons[
                      category.icon as keyof typeof LucideIcons
                    ] as React.ComponentType<{ className?: string }>
                    return IconComponent &&
                      typeof IconComponent !== 'string' ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded border bg-muted">
                        <IconComponent className="h-5 w-5" />
                      </div>
                    ) : null
                  })()}
                  <code className="relative rounded bg-muted px-2 py-[0.3rem] font-mono text-sm">
                    {category.icon}
                  </code>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Order
                </p>
                <p className="text-sm font-medium">{category.order}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Created
                </p>
                <p className="text-sm">
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {category.parentId && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Parent ID
                </p>
                <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-xs block break-all">
                  {category.parentId}
                </code>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => onEdit(category)}
                className="flex-1"
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete(category)}
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
  )
}
