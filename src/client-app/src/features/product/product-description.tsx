import { Button } from '@/components/ui/button'
import { Star, TicketPercent } from 'lucide-react'

type ProductDescriptionProps = {
  product: {
    name: string
    description: string
    price: number
    sku: string
  }
}

export default function ProductDescription({
  product,
}: ProductDescriptionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1 ">
        <h1 className="text-xl font-bold">{product.name}</h1>
        <p className="bg-secondary rounded-2xl px-2 py-1 text-sm font-bold shrink-0 ">
          SKU: {product.sku}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="bg-orange-500/70 w-16 h-6 flex items-centers"
          variant="ghost"
        >
          <Star color="white"></Star>
          <p className="text-white"> 4.5 </p>
        </Button>
        <p className="text-primary/50">Zobacz recenzje</p>
      </div>
      <div className="text-primary/70">{product.description}</div>
      <div>
        <h1 className="text-2xl font-bold py-5">
          {product.price.toFixed(2)} zł
        </h1>
      </div>
      <div className="flex gap-2 items-center">
        <TicketPercent size={40} />
        <p className="text-xl font-bold">Oferty</p>
      </div>
      <div className="flex gap-4 items-center">
        <div className="min-h-36 w-1/3 border rounded-2xl p-5 flex flex-col gap-2">
          <h1 className="text-md font-bold">Darmowa dostawa</h1>
          <p className="text-primary/50 ">Przy zamówieniach powyżej 100 zł</p>
          <Button className="h-8">Szczegóły</Button>
        </div>
        <div className="min-h-36 w-1/3 border rounded-2xl p-5 flex flex-col gap-2">
          <h1 className="text-md font-bold">Gwarancja</h1>
          <p className="text-primary/50 ">2 lata gwarancji producenta</p>
          <Button className="h-8">Szczegóły</Button>
        </div>
        <div className="min-h-36 w-1/3 border rounded-2xl p-5 flex flex-col gap-2">
          <h1 className="text-md font-bold">Zwroty</h1>
          <p className="text-primary/50 ">
            30 dni na zwrot lub wymianę produktu
          </p>
          <Button className="h-8">Szczegóły</Button>
        </div>
      </div>
    </div>
  )
}
