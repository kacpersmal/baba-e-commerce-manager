import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useChangeUserRole,
  useVerifyUser,
  useUnverifyUser,
  useDeleteUser,
} from '@/features/admin/users/hooks'
import { UsersTable } from '@/features/admin/users/components/users-table'
import { CreateUserDialog } from '@/features/admin/users/components/create-user-dialog'
import { EditUserDialog } from '@/features/admin/users/components/edit-user-dialog'
import { ChangeRoleDialog } from '@/features/admin/users/components/change-role-dialog'
import { PageHeader } from '@/features/admin/shared/components/page-header'
import { SearchInput } from '@/features/admin/shared/components/search-input'
import { Pagination } from '@/features/admin/shared/components/pagination'
import { LoadingState } from '@/features/admin/shared/components/loading-state'
import { EmptyState } from '@/features/admin/shared/components/empty-state'
import { DeleteConfirmDialog } from '@/features/admin/shared/components/delete-confirm-dialog'
import { useDebounce } from '@/features/admin/shared/hooks/use-debounce'
import { toast } from 'sonner'
import { UserCog } from 'lucide-react'
import type { components } from '@/lib/api/schema'

type UserResponse = components['schemas']['UserResponseDto']
type CreateUserDto = components['schemas']['CreateUserDto']
type UpdateUserDto = components['schemas']['UpdateUserDto']

export const Route = createFileRoute('/admin/users/manage')({
  component: UsersManagePage,
})

function UsersManagePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  const debouncedSearch = useDebounce(searchQuery)

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

  const handleCreateUser = async (data: CreateUserDto) => {
    try {
      await createUser.mutateAsync(data)
      toast.success('User created successfully')
      setCreateDialogOpen(false)
    } catch (error) {
      toast.error('Failed to create user')
      console.error(error)
    }
  }

  const handleEditUser = async (id: string, data: UpdateUserDto) => {
    try {
      await updateUser.mutateAsync({ id, dto: data })
      toast.success('User updated successfully')
      setEditDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      toast.error('Failed to update user')
      console.error(error)
    }
  }

  const handleChangeRole = async (id: string, role: 'USER' | 'ADMIN') => {
    try {
      await changeRole.mutateAsync({ id, dto: { role } })
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
    setEditDialogOpen(true)
  }

  const openRoleDialog = (user: UserResponse) => {
    setSelectedUser(user)
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
        <PageHeader
          title="Users"
          description="Manage user accounts, roles, and verification status"
          actionLabel="Create User"
          onAction={() => setCreateDialogOpen(true)}
        />
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by email or name..."
        />
      </div>

      {isLoading ? (
        <LoadingState message="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState icon={UserCog} message="No users found" />
      ) : (
        <>
          <UsersTable
            users={users}
            onEdit={openEditDialog}
            onChangeRole={openRoleDialog}
            onToggleVerification={handleToggleVerification}
            onDelete={openDeleteDialog}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateUser}
        isPending={createUser.isPending}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
        onSubmit={handleEditUser}
        isPending={updateUser.isPending}
      />

      <ChangeRoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        user={selectedUser}
        onSubmit={handleChangeRole}
        isPending={changeRole.isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.email}? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        isPending={deleteUser.isPending}
      />
    </div>
  )
}
