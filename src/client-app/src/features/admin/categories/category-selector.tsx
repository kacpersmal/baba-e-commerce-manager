import { useState, useMemo } from 'react'
import { Check, ChevronsUpDown, Search, FolderOpen, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { components } from '@/lib/api/schema'

type CategoryResponse = components['schemas']['CategoryResponseDto']

interface CategorySelectorProps {
  categories: CategoryResponse[]
  value?: string
  onChange: (value: string) => void
  excludeId?: string
  disabled?: boolean
}

interface CategoryTreeItemProps {
  category: CategoryResponse
  level: number
  selectedId?: string
  onSelect: (id: string) => void
  searchQuery: string
  excludeId?: string
}

function CategoryTreeItem({
  category,
  level,
  selectedId,
  onSelect,
  searchQuery,
  excludeId,
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = category.children && category.children.length > 0
  const isSelected = selectedId === category.id
  const isExcluded = category.id === excludeId

  // Check if this category or any children match the search
  const matchesSearch = (cat: CategoryResponse, query: string): boolean => {
    if (!query) return true
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

  const shouldShow = matchesSearch(category, searchQuery) && !isExcluded

  if (!shouldShow) return null

  const directMatch =
    searchQuery &&
    (category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(category.id)}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded-sm text-sm transition-colors',
          isSelected && 'bg-accent',
          directMatch && 'bg-accent/50',
        )}
        style={{ paddingLeft: `${level * 0.75 + 0.5}rem` }}
      >
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="p-0.5 hover:bg-accent rounded"
          >
            <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        <div className="shrink-0">
          {isExpanded || !hasChildren ? (
            <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>

        <span className="flex-1 text-left truncate">{category.name}</span>

        {isSelected && <Check className="h-4 w-4" />}
      </button>

      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              searchQuery={searchQuery}
              excludeId={excludeId}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function CategorySelector({
  categories,
  value,
  onChange,
  excludeId,
  disabled,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedCategory = useMemo(() => {
    const findCategory = (
      cats: CategoryResponse[],
    ): CategoryResponse | null => {
      for (const cat of cats) {
        if (cat.id === value) return cat
        if (cat.children) {
          const found = findCategory(cat.children)
          if (found) return found
        }
      }
      return null
    }
    return value ? findCategory(categories) : null
  }, [value, categories])

  const handleSelect = (categoryId: string) => {
    onChange(categoryId)
    setOpen(false)
    setSearchQuery('')
  }

  const handleClear = () => {
    onChange('')
    setOpen(false)
    setSearchQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-full justify-between font-normal"
          disabled={disabled}
        >
          {selectedCategory ? (
            <span className="truncate">{selectedCategory.name}</span>
          ) : (
            <span className="text-muted-foreground">
              Select parent category (optional)
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <div className="flex flex-col">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1">
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded-sm text-sm transition-colors',
                !value && 'bg-accent',
              )}
            >
              <div className="w-4" />
              <span className="flex-1 text-left">None (Root Category)</span>
              {!value && <Check className="h-4 w-4" />}
            </button>

            {categories.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                level={0}
                selectedId={value}
                onSelect={handleSelect}
                searchQuery={searchQuery}
                excludeId={excludeId}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
