import { useState } from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface IconSelectorProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}

// Popular icons for categories
const popularIcons = [
  'Smartphone',
  'Laptop',
  'Monitor',
  'Tablet',
  'Watch',
  'Headphones',
  'Camera',
  'Gamepad2',
  'Tv',
  'Speaker',
  'Home',
  'Shirt',
  'ShoppingBag',
  'Sofa',
  'Utensils',
  'Book',
  'Dumbbell',
  'Music',
  'Bike',
  'Car',
  'Package',
  'Gift',
  'Heart',
  'Star',
  'Zap',
  'Sparkles',
  'Trophy',
  'Crown',
  'Flame',
  'Bolt',
]

export function IconSelector({ value, onChange, disabled }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIcons = popularIcons.filter((icon) =>
    icon.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName]
    return IconComponent
  }

  const SelectedIcon = value ? getIconComponent(value) : null

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
          {value && SelectedIcon ? (
            <span className="flex items-center gap-2">
              <SelectedIcon className="h-4 w-4" />
              <span className="truncate">{value}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select icon...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="flex flex-col">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-3">
            <div className="grid grid-cols-4 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = getIconComponent(iconName)
                if (!IconComponent) return null

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName)
                      setOpen(false)
                      setSearchQuery('')
                    }}
                    className={cn(
                      'relative flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-primary/10 hover:border-primary/20 transition-all duration-200 border-2',
                      value === iconName
                        ? 'bg-primary/10 border-primary/40 shadow-sm'
                        : 'border-transparent',
                    )}
                    title={iconName}
                  >
                    <IconComponent className="h-6 w-6 text-primary" />
                    <span className="text-[10px] font-medium truncate w-full text-center">
                      {iconName}
                    </span>
                    {value === iconName && (
                      <Check className="h-3 w-3 absolute top-1 right-1 text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <div className="mx-auto h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                  <Search className="h-5 w-5" />
                </div>
                No icons found
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
