import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { WarehouseForm } from '../warehouse-form'
import type { components } from '@/lib/api/schema'

type CreateWarehouseDto = components['schemas']['CreateWarehouseDto']

interface CreateWarehouseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (dto: CreateWarehouseDto) => void
  isPending: boolean
}

export function CreateWarehouseDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateWarehouseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Warehouse</DialogTitle>
          <DialogDescription>
            Add a new warehouse location to your system
          </DialogDescription>
        </DialogHeader>
        <WarehouseForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
