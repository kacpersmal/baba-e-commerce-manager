import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from './card'
import { Input } from './input'
import { Button } from './button'
import { Separator } from './separator'

export function Newsletter() {
  return (
    <section className="border-y bg-linear-to-br from-primary/10 to-background py-12 sm:py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="border-2">
          <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Zapisz się do newslettera
              </h2>
              <p className="text-lg text-muted-foreground">
                Otrzymaj{' '}
                <span className="font-semibold text-primary">10% zniżki</span>{' '}
                na pierwsze zamówienie
              </p>
            </div>
            <Separator className="w-20" />
            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Twój adres email"
                className="flex-1"
              />
              <Button size="lg" className="gap-2">
                Zapisz się
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Dołącz do 20 000+ subskrybentów. Możesz zrezygnować w każdej
              chwili.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

