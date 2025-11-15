import { ChevronRight, ChevronDown, FolderOpen, Folder } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { components } from '@/lib/api/schema'

type CategoryResponse = components['schemas']['CategoryResponseDto']

interface CategoryTreeNodeProps {
  category: CategoryResponse
  level?: number
  onSelect?: (category: CategoryResponse) => void
  onEdit?: (category: CategoryResponse) => void
  onDelete?: (category: CategoryResponse) => void
  selectedId?: string
}

export function CategoryTreeNode({
  category,
  level = 0,
  onSelect,
  onEdit,
  onDelete,
  selectedId,
}: CategoryTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = category.children && category.children.length > 0
  const isSelected = selectedId === category.id

  return (
    <div className="select-none group/item">
      <div
        className={cn(
          'flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-all duration-200',
          isSelected && 'bg-primary/10',
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => onSelect?.(category)}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className={cn(
            'p-0.5 h-5 w-5 flex items-center justify-center hover:bg-primary/10 rounded transition-all',
            !hasChildren && 'invisible',
          )}
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Folder Icon */}
        <div className="shrink-0">
          {isExpanded || !hasChildren ? (
            <FolderOpen
              className={cn('h-4 w-4', category.color || 'text-amber-500')}
            />
          ) : (
            <Folder
              className={cn('h-4 w-4', category.color || 'text-amber-500')}
            />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{category.name}</span>
          <span className="text-[11px] text-muted-foreground/70 truncate">
            {category.slug}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(category)
            }}
            className="px-2.5 py-1 text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md transition-all"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(category)
            }}
            className="px-2.5 py-1 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-md transition-all"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              level={level + 1}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CategoryTreeProps {
  categories: CategoryResponse[]
  onSelect?: (category: CategoryResponse) => void
  onEdit?: (category: CategoryResponse) => void
  onDelete?: (category: CategoryResponse) => void
  selectedId?: string
}

export function CategoryTree({
  categories,
  onSelect,
  onEdit,
  onDelete,
  selectedId,
}: CategoryTreeProps) {
  return (
    <div className="space-y-0.5">
      {categories.map((category) => (
        <CategoryTreeNode
          key={category.id}
          category={category}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedId={selectedId}
        />
      ))}
    </div>
  )
}
