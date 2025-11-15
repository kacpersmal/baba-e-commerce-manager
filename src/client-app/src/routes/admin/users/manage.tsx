import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useChangeUserRole,
  useVerifyUser,
  useUnverifyUser,
  useDeleteUser,
} from '@/features/admin/users/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  MoreVertical,
  Plus,
  Search,
  UserCog,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  User,
} from 'lucide-react'
import type { components } from '@/lib/api/schema'

type UserResponse = components['schemas']['UserResponseDto']
type CreateUserDto = components['schemas']['CreateUserDto']
type UpdateUserDto = components['schemas']['UpdateUserDto']

export const Route = createFileRoute('/admin/users/manage')({
  component: UsersManagePage,
})

function UsersManagePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data, isLoading } = useUsers(
    page,
    limit,
    debouncedSearch || undefined,
  )
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const changeRole = useChangeUserRole()
  const verifyUser = useVerifyUser()
  const unverifyUser = useUnverifyUser()
  const deleteUser = useDeleteUser()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)

  const [createFormData, setCreateFormData] = useState<CreateUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const [editFormData, setEditFormData] = useState<UpdateUserDto>({
    email: '',
    firstName: '',
    lastName: '',
  })

  const [newRole, setNewRole] = useState<'USER' | 'ADMIN'>('USER')

  const handleCreateUser = async () => {
    try {
      await createUser.mutateAsync(createFormData)
      toast.success('User created successfully')
      setCreateDialogOpen(false)
      setCreateFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      })
    } catch (error) {
      toast.error('Failed to create user')
      console.error(error)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return
    try {
      await updateUser.mutateAsync({
        id: selectedUser.id,
        dto: editFormData,
      })
      toast.success('User updated successfully')
      setEditDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      toast.error('Failed to update user')
      console.error(error)
    }
  }

  const handleChangeRole = async () => {
    if (!selectedUser) return
    try {
      await changeRole.mutateAsync({
        id: selectedUser.id,
        dto: { role: newRole },
      })
      toast.success('User role changed successfully')
      setRoleDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      toast.error('Failed to change user role')
      console.error(error)
    }
  }

  const handleToggleVerification = async (user: UserResponse) => {
    try {
      if (user.isVerified) {
        await unverifyUser.mutateAsync(user.id)
        toast.success('User unverified successfully')
      } else {
        await verifyUser.mutateAsync(user.id)
        toast.success('User verified successfully')
      }
    } catch (error) {
      toast.error('Failed to update verification status')
      console.error(error)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await deleteUser.mutateAsync(selectedUser.id)
      toast.success('User deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      toast.error('Failed to delete user')
      console.error(error)
    }
  }

  const openEditDialog = (user: UserResponse) => {
    setSelectedUser(user)
    setEditFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })
    setEditDialogOpen(true)
  }

  const openRoleDialog = (user: UserResponse) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setRoleDialogOpen(true)
  }

  const openDeleteDialog = (user: UserResponse) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const users = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage user accounts, roles, and verification status
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <UserCog className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <>
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
                      <Badge
                        variant={
                          user.role === 'ADMIN' ? 'default' : 'secondary'
                        }
                        className="gap-1"
                      >
                        {user.role === 'ADMIN' ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={user.isVerified ? 'default' : 'destructive'}
                        className="gap-1"
                      >
                        {user.isVerified ? (
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
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openRoleDialog(user)}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleVerification(user)}
                          >
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
                            onClick={() => openDeleteDialog(user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. They will be able to log in with
              these credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="user@example.com"
                value={createFormData.email}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="••••••••"
                value={createFormData.password}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-firstName">First Name</Label>
                <Input
                  id="create-firstName"
                  placeholder="John"
                  value={createFormData.firstName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-lastName">Last Name</Label>
                <Input
                  id="create-lastName"
                  placeholder="Doe"
                  value={createFormData.lastName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={createUser.isPending}>
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Password cannot be changed through this
              form.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="user@example.com"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  placeholder="John"
                  value={editFormData.firstName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  placeholder="Doe"
                  value={editFormData.lastName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updateUser.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.email}. Admin users have
              elevated permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-select">Role</Label>
              <Select
                value={newRole}
                onValueChange={(val) => setNewRole(val as 'USER' | 'ADMIN')}
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
              onClick={() => setRoleDialogOpen(false)}
              disabled={changeRole.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleChangeRole} disabled={changeRole.isPending}>
              {changeRole.isPending ? 'Changing...' : 'Change Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.email}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteUser.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
