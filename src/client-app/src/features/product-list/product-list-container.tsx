import ProductListItem from './product-list-item'
import { products } from './mock-data'
import ProductListPagination from './product-list-pagination'
export default function ProductListContainer() {
  return (
    <>
      <div className="min-h-[75vh] mx-auto my-15 flex flex-col gap-2  2xl:w-[70%] w-[90%]  p-2 ">
        {products.map((item) => (
          <ProductListItem productData={item} />
        ))}
        <ProductListPagination />
      </div>
    </>
  )
}
