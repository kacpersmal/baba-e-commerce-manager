import { Button } from '@/components/ui/button'
import { ShoppingCart, Zap, TrendingUp, Users, Package } from 'lucide-react'
import { ProductCard } from '@/components/ui/product-card'
import { FlashDealCard } from '@/components/ui/flash-deal-card'
import { TestimonialCard } from '@/components/ui/testimonial-card'
import { ProcessStep } from '@/components/ui/process-step'
import { FAQItem } from '@/components/ui/faq-item'
import { Newsletter } from '@/components/ui/newsletter'
import { Footer } from '@/components/ui/footer'
import { CountdownTimer } from '@/components/ui/countdown-timer'
import {
  featuredProducts,
  promoBenefits,
  testimonials,
  processSteps,
  flashDeals,
  faqItems,
} from './mock-data'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-950/50 via-background to-zinc-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container relative mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Odkryj niesamowite
                <br />
                <span className="text-primary">okazje każdego dnia</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-base text-muted-foreground sm:text-lg md:text-xl">
                Tysiące produktów w najlepszych cenach. Bezpieczne zakupy i
                szybka dostawa prosto do Twoich drzwi.
              </p>
            </div>
            <Button size="lg" className="gap-2 text-base">
              <ShoppingCart className="h-5 w-5" />
              Sprawdź oferty
            </Button>
            <div className="mt-8 grid grid-cols-3 gap-6 sm:gap-12">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold sm:text-3xl">50K+</p>
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Zadowolonych klientów
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <p className="text-2xl font-bold sm:text-3xl">10K+</p>
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Produktów
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold sm:text-3xl">99%</p>
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Pozytywnych opinii
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y bg-muted/30 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {promoBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-center gap-4 rounded-lg p-4 transition-colors hover:bg-muted"
              >
                <div
                  className={`rounded-full bg-background p-3 ${benefit.color}`}
                >
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-linear-to-br from-purple-950/50 via-violet-950/50 to-fuchsia-950/50 py-12 sm:py-16">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 via-violet-500/5 to-fuchsia-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />

        <div className="container relative mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-violet-500/50 bg-linear-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 px-6 py-2 backdrop-blur-sm">
                <Zap className="h-5 w-5 animate-pulse text-violet-500" />
                <span className="text-sm font-semibold text-violet-400">
                  OFERTA LIMITOWANA
                </span>
              </div>
              <h2 className="bg-linear-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                ⚡ Flash Deals
              </h2>
              <p className="text-sm text-muted-foreground">
                Najgorętsze okazje dnia - tylko teraz!
              </p>
            </div>
            <CountdownTimer />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flashDeals.map((deal) => (
              <div
                key={deal.id}
                className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-linear-to-br from-violet-500/10 to-purple-500/10 p-1 transition-all hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/20"
              >
                <div className="absolute inset-0 bg-linear-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative rounded-xl bg-background">
                  <FlashDealCard {...deal} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl space-y-8 px-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Wybrane produkty
            </h2>
            <p className="text-muted-foreground">
              Wybrane produkty w najlepszych cenach - tylko dziś!
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
      <section className="border-y bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl space-y-8 px-4">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Jak to działa?
            </h2>
            <p className="text-muted-foreground">
              Prosty proces zamówienia w 4 krokach
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={step.title}
                {...step}
                showArrow={index < processSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl space-y-8 px-4">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Co mówią nasi klienci?
            </h2>
            <p className="text-muted-foreground">
              Ponad 50 000 zadowolonych klientów
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-950/50 via-zinc-900/30 to-zinc-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />

        <div className="container relative mx-auto max-w-3xl space-y-10 px-4">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-semibold text-muted-foreground">
                POMOC
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Często zadawane pytania
            </h2>
            <p className="text-base text-muted-foreground">
              Masz pytania? Sprawdź nasze FAQ
            </p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </section>
      <Newsletter />
      <Footer />
    </div>
  )
}
