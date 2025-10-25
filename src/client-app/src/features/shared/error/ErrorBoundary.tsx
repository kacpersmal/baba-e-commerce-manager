import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface ErrorBoundaryProps {
  error: Error
  reset?: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="container flex items-center justify-center min-h-[50vh] py-12">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message || 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>

          {reset && (
            <Button onClick={reset} variant="outline" className="mt-4 w-full">
              Try again
            </Button>
          )}

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">
                Error details
              </summary>
              <pre className="mt-2 rounded-md bg-muted p-4 text-xs overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
