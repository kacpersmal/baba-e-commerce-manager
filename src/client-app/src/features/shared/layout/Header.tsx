import { Link } from '@tanstack/react-router'
import { Navbar } from '@/features/navbar/navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Package,
  ShoppingCart,
  Search,
  User,
  Cog,
  Settings,
} from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-brand-cream/95 backdrop-blur supports-backdrop-filter:bg-brand-cream/60">
      {/* Top Bar */}
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-brand-navy text-lg hover:opacity-80 transition-opacity"
        >
          <Package className="h-6 w-6 text-brand-orange" />
          Baba E-Commerce Manager
        </Link>

        {/* Search Bar */}
        <div className="relative w-full max-w-xl">
          <Input
            type="search"
            placeholder="Search products..."
            className="pr-12 border-brand-navy/20"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 border border-brand-navy/30 hover:border-brand-orange hover:bg-orange-500/20 transition-colors h-8 w-8"
          >
            <Search className="h-4 w-4 text-brand-navy" />
          </Button>
        </div>

        {/* Admin + User + Cart */}
        <div className="flex items-center gap-3">
          <Link to="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-orange-500/20"
            >
              <Settings className="h-5 w-5 text-brand-navy" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-orange-500/20"
          >
            <User className="h-5 w-5 text-brand-navy" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-orange-500/20 relative"
          >
            <ShoppingCart className="h-5 w-5 text-brand-navy" />
          </Button>
        </div>
      </div>

      {/* Categories Bar */}

      <Navbar />
    </header>
  )
}
