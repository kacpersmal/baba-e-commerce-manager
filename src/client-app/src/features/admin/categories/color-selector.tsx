import { useState } from 'react'
import { Check, ChevronsUpDown, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ColorSelectorProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}

const colorOptions = [
  { name: 'Red', class: 'text-red-500', bg: 'bg-red-500' },
  { name: 'Orange', class: 'text-orange-500', bg: 'bg-orange-500' },
  { name: 'Amber', class: 'text-amber-500', bg: 'bg-amber-500' },
  { name: 'Yellow', class: 'text-yellow-500', bg: 'bg-yellow-500' },
  { name: 'Lime', class: 'text-lime-500', bg: 'bg-lime-500' },
  { name: 'Green', class: 'text-green-500', bg: 'bg-green-500' },
  { name: 'Emerald', class: 'text-emerald-500', bg: 'bg-emerald-500' },
  { name: 'Teal', class: 'text-teal-500', bg: 'bg-teal-500' },
  { name: 'Cyan', class: 'text-cyan-500', bg: 'bg-cyan-500' },
  { name: 'Sky', class: 'text-sky-500', bg: 'bg-sky-500' },
  { name: 'Blue', class: 'text-blue-500', bg: 'bg-blue-500' },
  { name: 'Indigo', class: 'text-indigo-500', bg: 'bg-indigo-500' },
  { name: 'Violet', class: 'text-violet-500', bg: 'bg-violet-500' },
  { name: 'Purple', class: 'text-purple-500', bg: 'bg-purple-500' },
  { name: 'Fuchsia', class: 'text-fuchsia-500', bg: 'bg-fuchsia-500' },
  { name: 'Pink', class: 'text-pink-500', bg: 'bg-pink-500' },
  { name: 'Rose', class: 'text-rose-500', bg: 'bg-rose-500' },
  { name: 'Slate', class: 'text-slate-500', bg: 'bg-slate-500' },
  { name: 'Gray', class: 'text-gray-500', bg: 'bg-gray-500' },
  { name: 'Zinc', class: 'text-zinc-500', bg: 'bg-zinc-500' },
]

export function ColorSelector({
  value,
  onChange,
  disabled,
}: ColorSelectorProps) {
  const [open, setOpen] = useState(false)
  const [customValue, setCustomValue] = useState(value || '')

  const selectedColor = colorOptions.find((c) => c.class === value)

  const handleColorSelect = (colorClass: string) => {
    onChange(colorClass)
    setCustomValue(colorClass)
    setOpen(false)
  }

  const handleCustomChange = (val: string) => {
    setCustomValue(val)
    onChange(val)
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
          {value ? (
            <span className="flex items-center gap-2">
              {selectedColor ? (
                <>
                  <div className={cn('h-4 w-4 rounded', selectedColor.bg)} />
                  <span className="truncate">{selectedColor.name}</span>
                </>
              ) : (
                <>
                  <Palette className="h-4 w-4" />
                  <span className="truncate font-mono text-xs">{value}</span>
                </>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">Select color...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="flex flex-col">
          <div className="p-3 border-b bg-muted/30">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Custom Tailwind Class
            </label>
            <Input
              placeholder="e.g., text-blue-500"
              value={customValue}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="h-9 bg-background font-mono text-sm"
            />
          </div>
          <div className="p-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Preset Colors
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.class}
                  type="button"
                  onClick={() => handleColorSelect(color.class)}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-accent transition-all duration-200 border-2',
                    value === color.class
                      ? 'bg-accent ring-2 ring-primary border-primary/40 shadow-sm'
                      : 'border-transparent',
                  )}
                  title={color.name}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full shadow-md ring-2 ring-background',
                      color.bg,
                    )}
                  />
                  <span className="text-[10px] font-medium truncate w-full text-center">
                    {color.name}
                  </span>
                  {value === color.class && (
                    <Check className="h-3 w-3 absolute top-1 right-1 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
