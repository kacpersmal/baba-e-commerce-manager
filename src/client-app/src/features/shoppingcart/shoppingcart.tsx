import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useState } from "react"

export function ShoppingCartContent() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Bezprzewodowe słuchawki",
            price: 79.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
        },
        {
            id: 2,
            name: "Smartwatch Pro",
            price: 129.99,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
        },
        {
            id: 3,
            name: "Mysz gamingowa RGB",
            price: 49.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
        },
    ])
    {/* ilość przedmiotów dodawanie,odejmowanie */ }
    const handleQuantityChange = (id: number, delta: number) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        )
    }
    {/* usuwanie przedmiotów z koszyka*/ }
    const handleRemove = (id: number) => {
        setCartItems((items) => items.filter((item) => item.id !== id))
    }
    {/* obliczanie sumy */ }
    const subtotal = cartItems
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
    {/* suma itemków w koszyku */ }
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-orange-500/20 group"
                >
                    <ShoppingCart className="h-5 w-5 text-brand-navy group-hover:text-orange-500 transition-colors" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold shadow-md">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[400px] sm:w-[480px] top-16 h-[calc(100vh-4rem)] flex flex-col p-0"
            >
                <SheetHeader className="border-b px-4 py-3">
                    <SheetTitle className="text-lg font-semibold">Twój koszyk</SheetTitle>
                    <SheetDescription>
                        Sprawdź swoje produkty przed złożeniem zamówienia.
                    </SheetDescription>
                </SheetHeader>

                {/* Produkty w koszyku */}
                <ScrollArea className="flex-1 px-4 py-2 max-h-[calc(91vh-14rem)]">
                    <div className="divide-y">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-4 gap-4"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />

                                    <div className="flex-1">
                                        <p className="font-medium text-gray-200">{item.name}</p>
                                        <p className="text-sm text-gray-200">{item.price.toFixed(2)} zł</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-6 text-center">{item.quantity}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleQuantityChange(item.id, +1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                                <ShoppingCart className="h-10 w-10 mb-3 opacity-70" />
                                <p className="text-sm">Twój koszyk jest pusty</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <Separator />

                {/* Stopka */}
                <SheetFooter className="px-4 py-3 space-y-3 bg-brand-navy text-white rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-200">Suma</span>
                        <span className="font-semibold text-white text-lg">{subtotal} zł</span>
                    </div>

                    <div className="flex gap-2">
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                            Złóż zamówienie
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline" className="flex-1 bg-white text-brand-navy hover:bg-gray-100">
                                Zamknij
                            </Button>
                        </SheetClose>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
