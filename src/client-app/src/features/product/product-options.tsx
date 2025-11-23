const sizes = [
  { value: '1', label: 'Screen : 13"' },
  { value: '2', label: 'Screen : 15"' },
  { value: '3', label: 'Screen : 17"' },
]
const memory = [
  { value: '1', label: '256 M.2 SSD' },
  { value: '2', label: '512 M.2 SSD' },
  { value: '3', label: '1TB M.2 SSD' },
]

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Minus, Plus } from 'lucide-react'
import { useId } from 'react'

export default function ProductOptions() {
  const id = useId()
  return (
    <>
      <div className="flex flex-col justify-between h-full w-full ">
        <div>
          {' '}
          {/* SIZE RADIO */}
          <div className="">
            <h1 className="text-xl font-bold p-2">Size :</h1>
            <RadioGroup className="flex w-full  gap-2 items-center">
              {sizes.map((item) => (
                <label
                  key={`${id}-${item.value}`}
                  className="border-input has-data-[state=checked]:border-primary/80 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex flex-col gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                >
                  <RadioGroupItem
                    //   checked={item.checked}
                    id={`${id}-${item.value}`}
                    value={item.value}
                    className="sr-only w-1/3 "
                    aria-label={`size-radio-${item.value}`}
                  />
                  <p className="text-foreground text-sm leading-none font-medium">
                    {item.label}
                  </p>
                </label>
              ))}
            </RadioGroup>
          </div>
          {/* MEMORY RADIO */}
          <div>
            <h1 className="text-xl font-bold p-2">Memory :</h1>
            <RadioGroup className="flex w-full  items-center">
              {memory.map((item) => (
                <label
                  key={`${id}-${item.value}`}
                  className="border-input has-data-[state=checked]:border-primary/80 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex flex-col gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] "
                >
                  <RadioGroupItem
                    //   checked={item.checked}
                    id={`${id}-${item.value}`}
                    value={item.value}
                    className="sr-only w-1/3 "
                    aria-label={`size-radio-${item.value}`}
                  />
                  <p className="text-foreground text-sm leading-none font-medium">
                    {item.label}
                  </p>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className=" flex gap-10 items-center mt-5">
            <h1 className="font-bold text-2xl">$420.69 </h1>
            <div className="flex items-center gap-2 ">
              <Button size="sm" variant="secondary">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center"> 1 </span>
              <Button size="sm" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Button className="text-md font-bold w-full">Add To Cart</Button>
          </div>
        </div>
      </div>
    </>
  )
}
