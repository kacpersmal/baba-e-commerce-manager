import { Button } from '@/components/ui/button'
import { Star, TicketPercent } from 'lucide-react'

export default function ProductDescription() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1 ">
        <h1 className="text-xl font-bold">
          Laptop APPLE MacBook Air Retina M2 16GB RAM{' '}
        </h1>
        <p className="bg-secondary rounded-2xl px-2 py-1 text-sm font-bold shrink-0 ">
          {' '}
          Best Seller
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
        <p className="text-primary/50">1453 Revievs</p>
        <div className="flex gap-2">
          <p className="text-primary/50 font-light text-sm">1305 sold</p>

          <p className="text-green-600 font-light text-sm border-l-2 pl-2">
            247 in stock
          </p>
        </div>
      </div>
      <div className="text-primary/70">
        The MacBook Pro is a reliable and high-performance laptop designed for
        work, creativity, and everyday use. It features a fast Apple Silicon
        processor, a bright and sharp Retina display, and long-lasting battery
        life, ensuring smooth performance even during demanding tasks. Its sleek
        aluminum body gives it a premium look, while the backlit keyboard and
        precise trackpad provide excellent comfort. Perfect for professionals
        and anyone who values top-quality technology.
      </div>
      <div>
        <h1 className="text-2xl font-bold py-5">$420.69</h1>
      </div>
      <div className="flex gap-2 items-center">
        <TicketPercent size={40} />
        <p className="text-xl font-bold">Offers</p>
      </div>
      <div className="flex gap-4 items-center">
        <div className="min-h-36 w-1/3 border rounded-2xl p-5 flex flex-col gap-2">
          <h1 className="text-md font-bold">No Cost EMI</h1>
          <p className="text-primary/50 ">
            Upto $10 EMI interest savings on Amazon pay ICICI
          </p>
          <Button className="h-8">{'1 Offer >'}</Button>
        </div>
        <div className="min-h-36 w-1/3 border rounded-2xl p-5 flex flex-col gap-2">
          <h1 className="text-md font-bold">Bank Offer</h1>
          <p className="text-primary/50 ">
            Upto $30 Discount on select credit cards, select...
          </p>
          <Button className="h-8">{'28 Offer >'}</Button>
        </div>
        <div className="min-h-36 w-1/3 border rounded-2xl p-5 flex flex-col gap-2">
          <h1 className="text-md font-bold">Partner Offers</h1>
          <p className="text-primary/50 ">
            Get GST invoice and save up to 28% on business...
          </p>
          <Button className="h-8">{'28 Offer >'}</Button>
        </div>
      </div>
    </div>
  )
}
