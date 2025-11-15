import { Badge } from '@/components/ui/badge'
import { Shield, User } from 'lucide-react'

interface RoleBadgeProps {
  role: 'USER' | 'ADMIN'
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <Badge
      variant={role === 'ADMIN' ? 'default' : 'secondary'}
      className="gap-1"
    >
      {role === 'ADMIN' ? (
        <Shield className="h-3 w-3" />
      ) : (
        <User className="h-3 w-3" />
      )}
      {role}
    </Badge>
  )
}
