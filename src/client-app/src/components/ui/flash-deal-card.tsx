import { Star, ShoppingCart } from 'lucide-react'
import { Card } from './card'
import { Badge } from './badge'
import { Button } from './button'

export interface FlashDealCardProps {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  image: string
  rating: number
  soldCount: number
  stock: number
}

export function FlashDealCard({
  name,
  price,
  originalPrice,
  discount,
  image,
  rating,
  soldCount,
  stock,
}: FlashDealCardProps) {
  return (
    <Card className="group relative cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:shadow-violet-500/10">
      <div className="flex gap-4 p-4">
        <div className="relative h-24 w-24 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <Badge className="absolute -right-1.5 -top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 p-0 text-[10px] font-bold shadow-lg">
            -{discount}%
          </Badge>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
              {name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-medium">{rating}</span>
              <span className="text-xs text-muted-foreground">
                ({soldCount})
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-violet-500">
                {price.toFixed(2)} zł
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {originalPrice.toFixed(2)} zł
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Pozostało: {stock} szt.
            </div>
          </div>
        </div>
      </div>
      <div className="border-t px-4 py-2">
        <Button className="w-full bg-violet-500 hover:bg-violet-600" size="sm">
          <ShoppingCart className="mr-2 h-3 w-3" />
          Kup teraz
        </Button>
      </div>
    </Card>
  )
}
