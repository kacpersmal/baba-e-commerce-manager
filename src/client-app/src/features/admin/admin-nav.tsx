import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  Warehouse,
  BarChart3,
  FolderTree,
  Box,
  Building2,
  Map,
  Users,
} from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu'

const navigationItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    items: [{ title: 'Overview', href: '/admin', icon: BarChart3 }],
  },
  {
    title: 'Products',
    icon: Package,
    items: [
      {
        title: 'Manage Categories',
        href: '/admin/categories',
        icon: FolderTree,
      },
      { title: 'Manage Products', href: '/admin/products', icon: Box },
    ],
  },
  {
    title: 'Warehouses',
    icon: Warehouse,
    items: [
      {
        title: 'Warehouse Map',
        href: '/admin/warehouses/map',
        icon: Map,
      },
      {
        title: 'Manage Warehouses',
        href: '/admin/warehouses/manage',
        icon: Building2,
      },
    ],
  },
  {
    title: 'Users',
    icon: Users,
    items: [
      { title: 'Manage Users', href: '/admin/users/manage', icon: Users },
    ],
  },
]

export function AdminNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-brand-cream/95 backdrop-blur supports-backdrop-filter:bg-brand-cream/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {navigationItems.map((item) => {
              const Icon = item.icon

              return (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="bg-transparent text-brand-navy hover:bg-orange-500/10 hover:text-orange-500 data-[state=open]:bg-orange-500/10 data-[state=open]:text-orange-500">
                    <Icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[220px] gap-1 p-2">
                      {item.items.map((subItem) => {
                        const SubIcon = subItem.icon
                        return (
                          <li key={subItem.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={subItem.href}
                                className="flex flex-row items-center gap-2 select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-orange-500/10 hover:text-orange-600 focus:bg-orange-500/10 focus:text-orange-600"
                              >
                                {SubIcon && (
                                  <SubIcon className="h-4 w-4 shrink-0" />
                                )}
                                {subItem.title}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        )
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}

export default AdminNav
