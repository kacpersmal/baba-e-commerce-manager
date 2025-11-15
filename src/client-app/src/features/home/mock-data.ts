import { Package, ShieldCheck, Headphones, Truck, ShoppingBag, PackageCheck, Send, Home, Users, TrendingUp, Award } from 'lucide-react'

export interface FeaturedProduct {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  image: string
  rating: number
  soldCount: number
  category: string
}

export interface PromoBenefit {
  icon: typeof Package
  title: string
  description: string
  color: string
}

export interface Testimonial {
  id: string
  name: string
  avatar: string
  rating: number
  comment: string
  date: string
}

export interface ProcessStep {
  icon: typeof ShoppingBag
  title: string
  description: string
  color: string
}

export interface Statistic {
  value: string
  label: string
  icon: typeof Package
  color: string
}

export interface TrustBadge {
  name: string
  image: string
}

export interface Brand {
  name: string
  logo: string
}

export interface FlashDeal {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  image: string
  rating: number
  soldCount: number
  stock: number
  endsAt: string
}

export interface FAQItem {
  question: string
  answer: string
}

export const promoBenefits: PromoBenefit[] = [
  {
    icon: Truck,
    title: 'Darmowa dostawa',
    description: 'Od zamówień powyżej 100 zł',
    color: 'text-blue-500',
  },
  {
    icon: ShieldCheck,
    title: 'Bezpieczne płatności',
    description: 'Szyfrowane transakcje',
    color: 'text-green-500',
  },
  {
    icon: Headphones,
    title: 'Wsparcie 24/7',
    description: 'Jesteśmy zawsze do dyspozycji',
    color: 'text-purple-500',
  },
  {
    icon: Package,
    title: 'Łatwe zwroty',
    description: '30 dni na zwrot produktu',
    color: 'text-orange-500',
  },
]

export const featuredProducts: FeaturedProduct[] = [
  {
    id: '1',
    name: 'Bezprzewodowe słuchawki Premium ANC',
    price: 299.99,
    originalPrice: 499.99,
    discount: 40,
    image: 'https://placehold.co/300x300/1e40af/ffffff?text=Słuchawki',
    rating: 4.8,
    soldCount: 2453,
    category: 'Elektronika',
  },
  {
    id: '2',
    name: 'Smartwatch Fitness Pro 2024',
    price: 449.99,
    originalPrice: 699.99,
    discount: 36,
    image: 'https://placehold.co/300x300/16a34a/ffffff?text=Smartwatch',
    rating: 4.6,
    soldCount: 1847,
    category: 'Elektronika',
  },
  {
    id: '3',
    name: 'Kurtka męska zimowa premium',
    price: 199.99,
    originalPrice: 349.99,
    discount: 43,
    image: 'https://placehold.co/300x300/ec4899/ffffff?text=Kurtka',
    rating: 4.9,
    soldCount: 3241,
    category: 'Moda',
  },
  {
    id: '4',
    name: 'Lampa LED Smart RGB',
    price: 79.99,
    originalPrice: 129.99,
    discount: 38,
    image: 'https://placehold.co/300x300/059669/ffffff?text=Lampa',
    rating: 4.5,
    soldCount: 5632,
    category: 'Dom i Ogród',
  },
  {
    id: '5',
    name: 'Zestaw kosmetyków do pielęgnacji',
    price: 149.99,
    originalPrice: 249.99,
    discount: 40,
    image: 'https://placehold.co/300x300/9333ea/ffffff?text=Kosmetyki',
    rating: 4.7,
    soldCount: 1456,
    category: 'Uroda',
  },
  {
    id: '6',
    name: 'Mata do jogi z torbą',
    price: 89.99,
    originalPrice: 139.99,
    discount: 36,
    image: 'https://placehold.co/300x300/f97316/ffffff?text=Mata',
    rating: 4.6,
    soldCount: 2167,
    category: 'Sport',
  },
  {
    id: '7',
    name: 'Aparat bezlusterkowy 4K',
    price: 2499.99,
    originalPrice: 3499.99,
    discount: 29,
    image: 'https://placehold.co/300x300/14b8a6/ffffff?text=Aparat',
    rating: 4.9,
    soldCount: 543,
    category: 'Fotografia',
  },
  {
    id: '8',
    name: 'Karma premium dla psów 15kg',
    price: 129.99,
    originalPrice: 179.99,
    discount: 28,
    image: 'https://placehold.co/300x300/eab308/ffffff?text=Karma',
    rating: 4.8,
    soldCount: 4321,
    category: 'Zwierzęta',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Anna Kowalska',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    rating: 5,
    comment: 'Szybka dostawa i świetna obsługa klienta! Polecam każdemu. Zamówione produkty były dokładnie takie jak w opisie.',
    date: '2024-11-10',
  },
  {
    id: '2',
    name: 'Piotr Nowak',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Piotr',
    rating: 5,
    comment: 'Najlepsze ceny na rynku! Kupuję tutaj regularnie i zawsze jestem zadowolony. Produkty wysokiej jakości.',
    date: '2024-11-08',
  },
  {
    id: '3',
    name: 'Katarzyna Wiśniewska',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Katarzyna',
    rating: 5,
    comment: 'Profesjonalizm na najwyższym poziomie. Zamówienie dotarło szybciej niż się spodziewałam. Polecam!',
    date: '2024-11-05',
  },
  {
    id: '4',
    name: 'Marcin Zieliński',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcin',
    rating: 5,
    comment: 'Świetny wybór produktów i konkurencyjne ceny. Obsługa klienta na medal. Z pewnością wrócę!',
    date: '2024-11-03',
  },
]

export const processSteps: ProcessStep[] = [
  {
    icon: ShoppingBag,
    title: 'Złóż zamówienie',
    description: 'Wybierz produkty i zamów online w kilka chwil',
    color: 'text-blue-500',
  },
  {
    icon: PackageCheck,
    title: 'Pakujemy',
    description: 'Starannie pakujemy Twoje zamówienie',
    color: 'text-green-500',
  },
  {
    icon: Send,
    title: 'Wysyłamy',
    description: 'Przekazujemy przesyłkę kurierowi',
    color: 'text-purple-500',
  },
  {
    icon: Home,
    title: 'Otrzymujesz',
    description: 'Dostawa pod Twoje drzwi w 24-48h',
    color: 'text-orange-500',
  },
]

export const statistics: Statistic[] = [
  {
    value: '50 000+',
    label: 'Zadowolonych klientów',
    icon: Users,
    color: 'text-blue-500',
  },
  {
    value: '100 000+',
    label: 'Produktów w ofercie',
    icon: Package,
    color: 'text-green-500',
  },
  {
    value: '10 000+',
    label: 'Zamówień dziennie',
    icon: TrendingUp,
    color: 'text-purple-500',
  },
  {
    value: '4.9/5',
    label: 'Średnia ocen',
    icon: Award,
    color: 'text-yellow-500',
  },
]

export const trustBadges: TrustBadge[] = [
  {
    name: 'BLIK',
    image: 'https://placehold.co/120x60/1e40af/ffffff?text=BLIK',
  },
  {
    name: 'PayPal',
    image: 'https://placehold.co/120x60/0070ba/ffffff?text=PayPal',
  },
  {
    name: 'Visa',
    image: 'https://placehold.co/120x60/1a1f71/ffffff?text=Visa',
  },
  {
    name: 'Mastercard',
    image: 'https://placehold.co/120x60/eb001b/ffffff?text=Mastercard',
  },
  {
    name: 'Przelewy24',
    image: 'https://placehold.co/120x60/d4021d/ffffff?text=P24',
  },
  {
    name: 'SSL',
    image: 'https://placehold.co/120x60/16a34a/ffffff?text=SSL',
  },
]

export const brands: Brand[] = [
  {
    name: 'Samsung',
    logo: 'https://placehold.co/150x80/1e40af/ffffff?text=Samsung',
  },
  {
    name: 'Apple',
    logo: 'https://placehold.co/150x80/64748b/ffffff?text=Apple',
  },
  {
    name: 'Sony',
    logo: 'https://placehold.co/150x80/0f172a/ffffff?text=Sony',
  },
  {
    name: 'LG',
    logo: 'https://placehold.co/150x80/dc2626/ffffff?text=LG',
  },
  {
    name: 'Xiaomi',
    logo: 'https://placehold.co/150x80/f97316/ffffff?text=Xiaomi',
  },
  {
    name: 'Huawei',
    logo: 'https://placehold.co/150x80/dc2626/ffffff?text=Huawei',
  },
]

export const flashDeals: FlashDeal[] = [
  {
    id: 'flash-1',
    name: 'Laptop Gaming RTX 4060',
    price: 3999.99,
    originalPrice: 5999.99,
    discount: 33,
    image: 'https://placehold.co/300x300/1e40af/ffffff?text=Laptop',
    rating: 4.8,
    soldCount: 234,
    stock: 12,
    endsAt: '2024-11-14T23:59:59',
  },
  {
    id: 'flash-2',
    name: 'iPhone 15 Pro Max 256GB',
    price: 5499.99,
    originalPrice: 6499.99,
    discount: 15,
    image: 'https://placehold.co/300x300/64748b/ffffff?text=iPhone',
    rating: 4.9,
    soldCount: 567,
    stock: 8,
    endsAt: '2024-11-14T23:59:59',
  },
  {
    id: 'flash-3',
    name: 'Konsola PlayStation 5',
    price: 2299.99,
    originalPrice: 2799.99,
    discount: 18,
    image: 'https://placehold.co/300x300/0f172a/ffffff?text=PS5',
    rating: 4.9,
    soldCount: 892,
    stock: 5,
    endsAt: '2024-11-14T23:59:59',
  },
]

export const faqItems: FAQItem[] = [
  {
    question: 'Jak długo trwa dostawa?',
    answer: 'Standardowa dostawa trwa 24-48 godzin od momentu wysłania zamówienia. Oferujemy również dostawę ekspresową w ciągu 24 godzin za dodatkową opłatą.',
  },
  {
    question: 'Czy mogę zwrócić produkt?',
    answer: 'Tak, masz 30 dni na zwrot produktu bez podania przyczyny. Produkt musi być w oryginalnym opakowaniu i nieużywany. Zwrot pieniędzy następuje w ciągu 14 dni od otrzymania zwrotu.',
  },
  {
    question: 'Jakie są dostępne metody płatności?',
    answer: 'Akceptujemy płatności BLIK, kartą (Visa, Mastercard), PayPal, Przelewy24 oraz płatność za pobraniem przy odbiorze przesyłki.',
  },
  {
    question: 'Czy wysyłka jest darmowa?',
    answer: 'Tak! Oferujemy darmową dostawę dla zamówień powyżej 100 zł. Dla zamówień poniżej tej kwoty koszt dostawy wynosi 15 zł.',
  },
  {
    question: 'Jak mogę skontaktować się z obsługą klienta?',
    answer: 'Nasz zespół jest dostępny 24/7. Możesz skontaktować się z nami przez email, live chat na stronie lub telefon. Odpowiadamy na wszystkie zapytania w ciągu maksymalnie 2 godzin.',
  },
  {
    question: 'Czy produkty mają gwarancję?',
    answer: 'Wszystkie produkty objęte są gwarancją producenta. Dodatkowo oferujemy rozszerzoną gwarancję na wybrane produkty. Szczegóły znajdują się w opisie każdego produktu.',
  },
]

