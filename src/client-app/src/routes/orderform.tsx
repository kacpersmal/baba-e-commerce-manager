import { createFileRoute } from '@tanstack/react-router'
import OrderForm from '@/features/orderform/orderform'
export const Route = createFileRoute('/orderform')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex items-center w-[90%] 2xl:w-[70%] mx-auto h-full">
            <OrderForm />
        </div>
    )
}
