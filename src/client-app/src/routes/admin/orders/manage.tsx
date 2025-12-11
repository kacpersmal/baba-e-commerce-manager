import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export const Route = createFileRoute('/admin/orders/manage')({
  component: ManageOrdersPage,
})

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-700',
  PAID: 'bg-blue-500/20 text-blue-700',
  PROCESSING: 'bg-purple-500/20 text-purple-700',
  SHIPPED: 'bg-orange-500/20 text-orange-700',
  DELIVERED: 'bg-green-500/20 text-green-700',
  CANCELLED: 'bg-red-500/20 text-red-700',
}

const statusLabels = {
  PENDING: 'Oczekujące',
  PAID: 'Opłacone',
  PROCESSING: 'W realizacji',
  SHIPPED: 'Wysłane',
  DELIVERED: 'Dostarczone',
  CANCELLED: 'Anulowane',
}

function ManageOrdersPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>()

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Zarządzanie zamówieniami</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtruj po statusie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Wszystkie</SelectItem>
            <SelectItem value="PENDING">Oczekujące</SelectItem>
            <SelectItem value="PAID">Opłacone</SelectItem>
            <SelectItem value="PROCESSING">W realizacji</SelectItem>
            <SelectItem value="SHIPPED">Wysłane</SelectItem>
            <SelectItem value="DELIVERED">Dostarczone</SelectItem>
            <SelectItem value="CANCELLED">Anulowane</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numer zamówienia</TableHead>
              <TableHead>Użytkownik</TableHead>
              <TableHead>Całkowita kwota</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data utworzenia</TableHead>
              <TableHead>Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                Ładowanie zamówień...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
