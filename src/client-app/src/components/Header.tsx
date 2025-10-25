import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="text-xl font-semibold hover:text-gray-600 transition-colors"
        >
          Baba E-Commerce Manager
        </Link>
      </div>
    </header>
  )
}
