import { Button } from '@/components/ui/button'
import { Heart, Star } from 'lucide-react'
import type { ProductListItem } from './mock-data'
export default function ProductListItem({
  productData,
}: {
  productData: ProductListItem
}) {
  return (
    <div className="flex w-full p-4 border rounded-2xl justify-between ">
      <div className="flex gap-4 items-center">
        <ProductListItemImage imgsrc={productData.imgsrc} />
        <ProductListItemDescription
          name={productData.name}
          rewievs={productData.rewievs}
          rating={productData.rating}
          description={productData.description}
        />
      </div>
      <ProductListItemPricing
        price={productData.price}
        discount={productData.discount}
      />
    </div>
  )
}

function ProductListItemDescription({
  name,
  rewievs,
  rating,
  description,
}: {
  name: string
  rewievs: number
  rating: number
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
          <p className="text-white"> {rating} </p>
        </Button>
        <p className="text-primary/50">{rewievs} Revievs</p>
      </div>
      <p className="text-primary/50 text-sm line-clamp-3">{description}</p>

      <div className="flex gap-2 mt-2 items-center">
        <Button variant="outline">Add to cart</Button>
        <Button className=""> Buy now</Button>
      </div>
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
  discount,
}: {
  price: number
  discount: number | undefined
}) {
  return (
    <div className="flex flex-col gap-1 w-full items-end">
      {discount ? (
        <h1 className="font-bold"> ${price - price * (discount / 100)} </h1>
      ) : (
        <h1 className="font-bold"> ${price} </h1>
      )}

      <h1 className="font-bold"></h1>
      {discount && (
        <div className="flex gap-2 items-center text-sm">
          <p className="line-through text-primary/60">${price}</p>
          <p className="border rounded-[5px] text-xs border-green-700/50 bg bg-green-600/30 text-green-500 px-1 font-bold">
            -{discount}%
          </p>
        </div>
      )}

      <p className="text-primary/60 font-bold">Free delivery</p>
    </div>
  )
}
