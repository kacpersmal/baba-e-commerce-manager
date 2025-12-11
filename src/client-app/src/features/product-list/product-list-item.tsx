import { Button } from '@/components/ui/button'
import { Heart, Star } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { Link } from '@tanstack/react-router'

type ProductData = {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  slug: string
}

export default function ProductListItem({
  productData,
}: {
  productData: ProductData
}) {
  return (
    <div className="flex w-full p-4 border rounded-2xl justify-between ">
      <Link
        to="/product"
        search={{ slug: productData.slug }}
        className="flex gap-4 items-center flex-1 hover:opacity-80 transition-opacity"
      >
        <ProductListItemImage
          imgsrc={productData.imageUrl || './Placeholder_view_vector.svg.png'}
        />
        <ProductListItemDescription
          name={productData.name}
          description={productData.description}
        />
      </Link>
      <ProductListItemPricing
        price={productData.price}
        productId={productData.id}
      />
    </div>
  )
}

function ProductListItemDescription({
  name,
  description,
}: {
  name: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-2  w-[70%]">
      <h1 className="text-md font-bold">{name}</h1>
      <div className="flex gap-2">
        <Button
          className="bg-orange-500/70 w-16 h-6 flex items-centers"
          variant="ghost"
        >
          <Star color="white"></Star>
          <p className="text-white"> 4.5 </p>
        </Button>
        <p className="text-primary/50">Zobacz szczegóły</p>
      </div>
      <p className="text-primary/50 text-sm line-clamp-3">{description}</p>
    </div>
  )
}

function ProductListItemImage({ imgsrc }: { imgsrc: string }) {
  return (
    <div className="h-46 w-46  relative border rounded-md">
      <Button
        className="rounded-full absolute top-2 right-2 z-10"
        variant="ghost"
      >
        <Heart />
      </Button>
      <img
        src={imgsrc}
        className="obejct-cover w-full h-full rounded-md"
        alt=""
      />
    </div>
  )
}

function ProductListItemPricing({
  price,
  productId,
}: {
  price: number
  productId: number
}) {
  const { addToCart, isLoading } = useCartStore()

  const handleAddToCart = async () => {
    await addToCart(productId, 1)
  }

  return (
    <div className="flex flex-col gap-1 w-full items-end">
      <h1 className="font-bold"> {price.toFixed(2)} zł </h1>
      <p className="text-primary/60 font-bold">Darmowa dostawa</p>
      <div className="flex gap-2 mt-2 items-center">
        <Button
          variant="outline"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          Dodaj do koszyka
        </Button>
        <Button className="">Kup teraz</Button>
      </div>
    </div>
  )
}
