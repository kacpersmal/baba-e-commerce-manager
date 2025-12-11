import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Panel administratora</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wszystkie produkty
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">...</div>
            <p className="text-xs text-muted-foreground">Produkty w systemie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zamówienia</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">...</div>
            <p className="text-xs text-muted-foreground">Wszystkich zamówień</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Użytkownicy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">...</div>
            <p className="text-xs text-muted-foreground">
              Zarejestrowanych użytkowników
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Przychód</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">... zł</div>
            <p className="text-xs text-muted-foreground">Całkowity przychód</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Szybkie akcje</CardTitle>
            <CardDescription>Zarządzaj swoim sklepem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              to="/admin/products/manage"
              className="block p-3 border rounded-md hover:bg-accent transition-colors"
            >
              <div className="font-medium">Zarządzaj produktami</div>
              <div className="text-sm text-muted-foreground">
                Dodaj, edytuj lub usuń produkty
              </div>
            </Link>
            <Link
              to="/admin/orders/manage"
              className="block p-3 border rounded-md hover:bg-accent transition-colors"
            >
              <div className="font-medium">Zarządzaj zamówieniami</div>
              <div className="text-sm text-muted-foreground">
                Przeglądaj i aktualizuj zamówienia
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ostatnie aktywności</CardTitle>
            <CardDescription>Co dzieje się w Twoim sklepie</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Brak ostatnich aktywności
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
