import { RoleBadge } from './role-badge'
import { VerificationBadge } from './verification-badge'
import { UserActionsMenu } from './user-actions-menu'
import type { components } from '@/lib/api/schema'

type UserResponse = components['schemas']['UserResponseDto']

interface UsersTableProps {
  users: UserResponse[]
  onEdit: (user: UserResponse) => void
  onChangeRole: (user: UserResponse) => void
  onToggleVerification: (user: UserResponse) => void
  onDelete: (user: UserResponse) => void
}

export function UsersTable({
  users,
  onEdit,
  onChangeRole,
  onToggleVerification,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-4 font-medium">Email</th>
            <th className="text-left p-4 font-medium">Name</th>
            <th className="text-left p-4 font-medium">Role</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Created</th>
            <th className="text-right p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t hover:bg-muted/30">
              <td className="p-4 font-medium">{user.email}</td>
              <td className="p-4">
                {user.fullName || `${user.firstName} ${user.lastName}`}
              </td>
              <td className="p-4">
                <RoleBadge role={user.role} />
              </td>
              <td className="p-4">
                <VerificationBadge isVerified={user.isVerified} />
              </td>
              <td className="p-4 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <UserActionsMenu
                  user={user}
                  onEdit={onEdit}
                  onChangeRole={onChangeRole}
                  onToggleVerification={onToggleVerification}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
