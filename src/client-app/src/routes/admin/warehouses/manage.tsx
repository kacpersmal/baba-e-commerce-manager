import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Loader2, AlertCircle, Edit2, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { WarehouseForm } from '@/features/admin/warehouses/warehouse-form'
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

  const handleDelete = () => {
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Warehouses</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage warehouse locations
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id} className="transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{warehouse.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {warehouse.code}
                    </p>
                  </div>
                  <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {warehouse.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {warehouse.description}
                  </p>
                )}

                <div className="space-y-1 text-sm">
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{warehouse.address}</p>
                  <p className="text-muted-foreground">
                    {warehouse.city}
                    {warehouse.state && `, ${warehouse.state}`}
                  </p>
                  <p className="text-muted-foreground">
                    {warehouse.country} {warehouse.postalCode}
                  </p>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="font-medium">Contact</p>
                  <p className="text-muted-foreground">
                    {warehouse.contactName}
                  </p>
                  <p className="text-muted-foreground">
                    {warehouse.contactEmail}
                  </p>
                  <p className="text-muted-foreground">
                    {warehouse.contactPhone}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => openEditDialog(warehouse)}
                  >
                    <Edit2 className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => openDeleteDialog(warehouse)}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5 text-destructive" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Warehouse</DialogTitle>
            <DialogDescription>
              Add a new warehouse location to your system
            </DialogDescription>
          </DialogHeader>
          <WarehouseForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
            <DialogDescription>
              Update warehouse location and information
            </DialogDescription>
          </DialogHeader>
          {warehouseToEdit && (
            <WarehouseForm
              warehouse={warehouseToEdit}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setWarehouseToEdit(null)
              }}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Warehouse</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{warehouseToDelete?.name}"? This
              action will soft delete the warehouse.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setWarehouseToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
