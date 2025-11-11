import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { Flame, Sparkles, PercentCircle, LifeBuoy } from 'lucide-react'
import { useCategories, type Category } from '@/features/navbar/hooks'
import * as Icons from 'lucide-react'

export function Navbar() {
  const { data: categories, isLoading } = useCategories()
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [fade, setFade] = useState(false)

  // Set first category as active when data loads
  if (categories && categories.length > 0 && !activeCategory) {
    setActiveCategory(categories[0])
  }

  // Get icon component from icon name
  const getIcon = (iconName?: string) => {
    if (!iconName) return Icons.ShoppingBag
    return (Icons as any)[iconName] || Icons.ShoppingBag
  }

  return (
    <div className="border-t backdrop-blur shadow-sm">
      <div className="container mx-auto px-4 max-w-screen-2xl">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="px-0 flex gap-2">
            {/* Wszystkie kategorie */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-brand-navy text-base px-4 py-3 hover:text-orange-500 transition-colors">
                Wszystkie Kategorie
              </NavigationMenuTrigger>

              <NavigationMenuContent className=" shadow-xl p-6 rounded-md min-w-[1000px] flex gap-6 items-start">
                {isLoading ? (
                  <div className="w-full flex items-center justify-center py-8">
                    <p className="text-gray-500">Ładowanie kategorii...</p>
                  </div>
                ) : categories && categories.length > 0 ? (
                  <>
                    {/* Lewa kolumna */}
                    <ul className="w-1/3 border-r pr-6 space-y-2">
                      {categories.map((cat) => {
                        const Icon = getIcon(cat.icon)
                        return (
                          <li key={cat.id}>
                            <Link
                              to="/category/$category"
                              params={{ category: cat.slug }}
                              onMouseEnter={() => {
                                setFade(true)
                                setActiveCategory(cat)
                                setTimeout(() => setFade(false), 120)
                              }}
                              className={`flex items-center gap-3 px-3 py-2 text-base rounded transition-colors
                        ${
                          activeCategory?.id === cat.id
                            ? 'bg-orange-500/10 text-orange-600'
                            : 'hover:bg-orange-500/10 hover:text-orange-600'
                        }`}
                            >
                              <Icon
                                className={`h-6 w-6 ${cat.color || 'text-gray-500'}`}
                              />
                              {cat.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>

                    {/* Prawa kolumna */}
                    {activeCategory &&
                      activeCategory.children &&
                      activeCategory.children.length > 0 && (
                        <div
                          className={`w-2/3 pl-4 overflow-y-auto max-h-[472px] transition-opacity duration-150 ${
                            fade ? 'opacity-0' : 'opacity-100'
                          }`}
                        >
                          <p className="text-base text-gray-300 font-semibold mb-3">
                            {activeCategory.name}
                          </p>

                          <ul className="grid grid-cols-3 gap-3">
                            {activeCategory.children.map((item: Category) => (
                              <li key={item.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to="/category/$category"
                                    params={{ category: item.slug }}
                                    className="text-base block px-3 py-2 rounded hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center py-8">
                    <p className="text-gray-500">Brak kategorii</p>
                  </div>
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* 🔥 Bestsellery */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="inline-flex flex-row items-center gap-3 px-4 py-3 text-base text-brand-navy hover:text-orange-500 transition-colors whitespace-nowrap"
                >
                  <Flame className="h-6 w-6 text-orange-500" />
                  Bestsellery
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* 🆕 Nowości */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="inline-flex flex-row items-center gap-3 px-4 py-3 text-base text-brand-navy hover:text-orange-500 transition-colors whitespace-nowrap"
                >
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  Nowości
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* 💸 Promocje */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="inline-flex flex-row items-center gap-3 px-4 py-3 text-base text-brand-navy hover:text-orange-500 transition-colors whitespace-nowrap"
                >
                  <PercentCircle className="h-6 w-6 text-red-500" />
                  Promocje
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* ❓ Pomoc */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="inline-flex flex-row items-center gap-3 px-4 py-3 text-base text-brand-navy hover:text-orange-500 transition-colors whitespace-nowrap"
                >
                  <LifeBuoy className="h-6 w-6 text-blue-500" />
                  Pomoc
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}
