import { Star, Quote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './card'

export interface TestimonialCardProps {
  id: string
  name: string
  avatar: string
  rating: number
  comment: string
}

export function TestimonialCard({
  name,
  avatar,
  rating,
  comment,
}: TestimonialCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="h-12 w-12 rounded-full bg-muted"
          />
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <div className="flex items-center gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-yellow-500 text-yellow-500"
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Quote className="mb-2 h-6 w-6 text-primary/20" />
        <p className="text-sm text-muted-foreground">{comment}</p>
      </CardContent>
    </Card>
  )
}
