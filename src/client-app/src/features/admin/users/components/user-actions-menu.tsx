import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreVertical,
  Pencil,
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
} from 'lucide-react'
import type { components } from '@/lib/api/schema'

type UserResponse = components['schemas']['UserResponseDto']

interface UserActionsMenuProps {
  user: UserResponse
  onEdit: (user: UserResponse) => void
  onChangeRole: (user: UserResponse) => void
  onToggleVerification: (user: UserResponse) => void
  onDelete: (user: UserResponse) => void
}

export function UserActionsMenu({
  user,
  onEdit,
  onChangeRole,
  onToggleVerification,
  onDelete,
}: UserActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeRole(user)}>
          <Shield className="mr-2 h-4 w-4" />
          Change Role
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleVerification(user)}>
          {user.isVerified ? (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Unverify
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
