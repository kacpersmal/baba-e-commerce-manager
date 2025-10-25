import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-semibold hover:text-gray-600 transition-colors"
        >
          Baba E-Commerce Manager
        </Link>
        <nav className="flex gap-4">
          <Link
            to="/health"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            activeProps={{ className: 'text-blue-600 font-semibold' }}
          >
            Health
          </Link>
        </nav>
      </div>
    </header>
  )
}
