import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shield, User } from 'lucide-react'
import type { components } from '@/lib/api/schema'

type UserResponse = components['schemas']['UserResponseDto']

interface ChangeRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResponse | null
  onSubmit: (id: string, role: 'USER' | 'ADMIN') => Promise<void>
  isPending: boolean
}

export function ChangeRoleDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isPending,
}: ChangeRoleDialogProps) {
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER')

  useEffect(() => {
    if (user) {
      setRole(user.role)
    }
  }, [user])

  const handleSubmit = async () => {
    if (!user) return
    await onSubmit(user.id, role)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for {user?.email}. Admin users have elevated
            permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">Role</Label>
            <Select
              value={role}
              onValueChange={(val) => setRole(val as 'USER' | 'ADMIN')}
            >
              <SelectTrigger id="role-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User
                  </div>
                </SelectItem>
                <SelectItem value="ADMIN">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Changing...' : 'Change Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
