import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Package, Activity, ArrowRight } from 'lucide-react'

export function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col items-center space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Baba E-Commerce Manager
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            A modern, type-safe e-commerce management platform built with React,
            TanStack Router, and auto-generated API clients.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/health">
            <Button size="lg" className="gap-2">
              View System Health
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </Button>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Type-Safe APIs
              </CardTitle>
              <CardDescription>
                Auto-generated from OpenAPI schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full TypeScript types generated from your backend OpenAPI
                specification, ensuring compile-time safety for all API calls.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Modern Stack
              </CardTitle>
              <CardDescription>Latest React & tooling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built with React 19, TanStack Router, TanStack Query, and
                shadcn/ui for a modern development experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Feature Slices
              </CardTitle>
              <CardDescription>Vertical slice architecture</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Organized by business domain for better maintainability and
                scalability. Each feature is self-contained.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
