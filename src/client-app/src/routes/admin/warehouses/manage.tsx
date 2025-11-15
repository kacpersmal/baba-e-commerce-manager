import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Loader2, AlertCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageHeader } from '@/features/admin/shared/components/page-header'
import { SearchInput } from '@/features/admin/shared/components/search-input'
import { DeleteConfirmDialog } from '@/features/admin/shared/components/delete-confirm-dialog'
import { WarehouseCard } from '@/features/admin/warehouses/components/warehouse-card'
import { CreateWarehouseDialog } from '@/features/admin/warehouses/components/create-warehouse-dialog'
import { EditWarehouseDialog } from '@/features/admin/warehouses/components/edit-warehouse-dialog'
import {
  useWarehouses,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from '@/features/admin/warehouses/hooks'
import type { components } from '@/lib/api/schema'
import { toast } from 'sonner'

type WarehouseResponse = components['schemas']['WarehouseResponseDto']
type CreateWarehouseDto = components['schemas']['CreateWarehouseDto']
type UpdateWarehouseDto = components['schemas']['UpdateWarehouseDto']

export const Route = createFileRoute('/admin/warehouses/manage')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [warehouseToEdit, setWarehouseToEdit] =
    useState<WarehouseResponse | null>(null)
  const [warehouseToDelete, setWarehouseToDelete] =
    useState<WarehouseResponse | null>(null)

  const { data: response, isLoading, error } = useWarehouses()
  const createMutation = useCreateWarehouse()
  const updateMutation = useUpdateWarehouse()
  const deleteMutation = useDeleteWarehouse()

  const warehouses = response?.data || []
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreate = (dto: CreateWarehouseDto) => {
    createMutation.mutate(dto, {
      onSuccess: () => {
        toast.success('Warehouse created successfully')
        setIsCreateDialogOpen(false)
      },
      onError: (error) => {
        toast.error(`Failed to create warehouse: ${error.message}`)
      },
    })
  }

  const handleUpdate = (dto: UpdateWarehouseDto) => {
    if (!warehouseToEdit) return
    updateMutation.mutate(
      { id: warehouseToEdit.id, dto },
      {
        onSuccess: () => {
          toast.success('Warehouse updated successfully')
          setIsEditDialogOpen(false)
          setWarehouseToEdit(null)
        },
        onError: (error) => {
          toast.error(`Failed to update warehouse: ${error.message}`)
        },
      },
    )
  }

  const handleDelete = async () => {
    if (!warehouseToDelete) return
    deleteMutation.mutate(warehouseToDelete.id, {
      onSuccess: () => {
        toast.success('Warehouse deleted successfully')
        setIsDeleteDialogOpen(false)
        setWarehouseToDelete(null)
      },
      onError: (error) => {
        toast.error(`Failed to delete warehouse: ${error.message}`)
      },
    })
  }

  const openEditDialog = (warehouse: WarehouseResponse) => {
    setWarehouseToEdit(warehouse)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (warehouse: WarehouseResponse) => {
    setWarehouseToDelete(warehouse)
    setIsDeleteDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load warehouses: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <PageHeader
          title="Manage Warehouses"
          description="Create, edit, and manage warehouse locations"
          actionLabel="Add Warehouse"
          onAction={() => setIsCreateDialogOpen(true)}
        />
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search warehouses..."
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => (
          <WarehouseCard
            key={warehouse.id}
            warehouse={warehouse}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        ))}
      </div>

      {filteredWarehouses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No warehouses found</h3>
            <p className="mb-4 text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first warehouse'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Warehouse
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreateWarehouseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      <EditWarehouseDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        warehouse={warehouseToEdit}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Warehouse"
        description={`Are you sure you want to delete "${warehouseToDelete?.name}"? This action will soft delete the warehouse.`}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
