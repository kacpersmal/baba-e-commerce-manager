import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'

interface VerificationBadgeProps {
  isVerified: boolean
}

export function VerificationBadge({ isVerified }: VerificationBadgeProps) {
  return (
    <Badge variant={isVerified ? 'default' : 'destructive'} className="gap-1">
      {isVerified ? (
        <>
          <CheckCircle className="h-3 w-3" />
          Verified
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          Unverified
        </>
      )}
    </Badge>
  )
}
