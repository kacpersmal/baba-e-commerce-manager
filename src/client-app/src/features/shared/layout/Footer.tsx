import { Facebook, Instagram, Twitter, Youtube, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/90 backdrop-blur-sm text-brand-navy text-sm">
      <div className="max-w-screen-2xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Pomoc</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Centrum pomocy</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Dostawa i zwroty</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Płatności</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Bezpieczeństwo zakupów</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Moje konto</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Zamówienia</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Ulubione</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Kupony i rabaty</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Ustawienia</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Informacje</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-orange-500 transition-colors">O nas</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Kariera</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Regulamin</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Polityka prywatności</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Społeczność</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-5 text-gray-600">
          <p className="text-xs">
            © {new Date().getFullYear()} <span className="font-semibold text-gray-800">Baba E-Commerce Manager</span>.
            Wszelkie prawa zastrzeżone.
          </p>

          <div className="flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="p-2 rounded-full hover:bg-orange-50 transition-colors">
                <Icon className="h-4 w-4 text-gray-700 hover:text-orange-500" />
              </a>
            ))}
            <button className="flex items-center gap-1 border rounded-md px-2 py-1 text-xs hover:bg-orange-50 transition">
              <Globe className="h-3 w-3" /> Polski / PLN
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}