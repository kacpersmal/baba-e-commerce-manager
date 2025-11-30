import ProductDescription from './product-description'
import ProductOptions from './product-options'
import ProductReviews from "./product-reviews";

export default function ProductContainer() {
  return (
    <>
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-background -z-10" />
      <div className="flex flex-col min-h-[85vh] pt-10 px-20">
        <div className=" w-full flex p-2 gap-4">
          <div className="w-2/3  h-96 rounded-xl ">
            <img
              src="/macw2.jpg"
              alt=""
              className="object-cover object-center w-full h-full rounded-xl"
            />
          </div>
          <div className="w-1/3 h-96 rounded-xl flex flex-col gap-4">
            {/* carousel later */}
            <div className=" h-46 rounded-xl  ">
              <img
                src="/macw1.jpg"
                alt="mac"
                className="object-cover object-center w-full h-full rounded-xl"
              />
            </div>
            <div className=" h-46 rounded-xl  ">
              <img
                src="/macw3.jpg"
                alt="mac"
                className="object-cover object-center w-full h-full rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full min-h-96 p-2 gap-4 ">
          <div className="w-2/3  min-h-96  p-2">
            <ProductDescription />
          </div>
          <div className="w-1/3  min-h-96 rounded-md border p-5">
            <ProductOptions />
          </div>
        </div>
        <div className="w-full p-2">
          <ProductReviews />
        </div>
      </div>
    </>
  )
}
