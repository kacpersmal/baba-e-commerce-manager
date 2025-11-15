import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { WarehouseForm } from '../warehouse-form'
import type { components } from '@/lib/api/schema'

type WarehouseResponse = components['schemas']['WarehouseResponseDto']
type UpdateWarehouseDto = components['schemas']['UpdateWarehouseDto']

interface EditWarehouseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: WarehouseResponse | null
  onSubmit: (dto: UpdateWarehouseDto) => void
  isPending: boolean
}

export function EditWarehouseDialog({
  open,
  onOpenChange,
  warehouse,
  onSubmit,
  isPending,
}: EditWarehouseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Warehouse</DialogTitle>
          <DialogDescription>
            Update warehouse location and information
          </DialogDescription>
        </DialogHeader>
        {warehouse && (
          <WarehouseForm
            warehouse={warehouse}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
