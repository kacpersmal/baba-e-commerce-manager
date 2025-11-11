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
import { categories } from '@/features/navbar/categories'

export function Navbar() {
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [fade, setFade] = useState(false)

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
                {/* Lewa kolumna */}
                <ul className="w-1/3 border-r pr-6 space-y-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <li key={cat.title}>
                        <Link
                          to={cat.href}
                          onMouseEnter={() => {
                            setFade(true)
                            setActiveCategory(cat)
                            setTimeout(() => setFade(false), 120)
                          }}
                          className={`flex items-center gap-3 px-3 py-2 text-base rounded transition-colors
                        ${
                          activeCategory.title === cat.title
                            ? 'bg-orange-500/10 text-orange-600'
                            : 'hover:bg-orange-500/10 hover:text-orange-600'
                        }`}
                        >
                          <Icon className={`h-6 w-6 ${cat.color}`} />
                          {cat.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                {/* Prawa kolumna */}
                <div
                  className={`w-2/3 pl-4 overflow-y-auto max-h-[472px] transition-opacity duration-150 ${
                    fade ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <p className="text-base text-gray-300 font-semibold mb-3">
                    {activeCategory.title}
                  </p>

                  <ul className="grid grid-cols-3 gap-3">
                    {activeCategory.sub.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="text-base block px-3 py-2 rounded hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
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
