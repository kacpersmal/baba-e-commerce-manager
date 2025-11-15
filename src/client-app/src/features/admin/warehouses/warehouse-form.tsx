import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { CoordinateSelector } from './coordinate-selector'
import type { components } from '@/lib/api/schema'

type WarehouseResponse = components['schemas']['WarehouseResponseDto']
type CreateWarehouseDto = components['schemas']['CreateWarehouseDto']

type WarehouseFormData = CreateWarehouseDto

interface WarehouseFormProps {
  warehouse?: WarehouseResponse
  onSubmit: (data: WarehouseFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function WarehouseForm({
  warehouse,
  onSubmit,
  onCancel,
  isSubmitting,
}: WarehouseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<WarehouseFormData>({
    defaultValues: warehouse
      ? {
          name: warehouse.name,
          code: warehouse.code,
          description: warehouse.description,
          latitude: warehouse.latitude,
          longitude: warehouse.longitude,
          address: warehouse.address,
          city: warehouse.city,
          state: warehouse.state,
          country: warehouse.country,
          postalCode: warehouse.postalCode,
          contactName: warehouse.contactName,
          contactEmail: warehouse.contactEmail,
          contactPhone: warehouse.contactPhone,
        }
      : undefined,
  })

  useEffect(() => {
    if (warehouse) {
      reset({
        name: warehouse.name,
        code: warehouse.code,
        description: warehouse.description,
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
        address: warehouse.address,
        city: warehouse.city,
        state: warehouse.state,
        country: warehouse.country,
        postalCode: warehouse.postalCode,
        contactName: warehouse.contactName,
        contactEmail: warehouse.contactEmail,
        contactPhone: warehouse.contactPhone,
      })
    }
  }, [warehouse, reset])

  // Register coordinate fields for validation
  useEffect(() => {
    register('latitude', {
      required: 'Latitude is required',
      min: { value: -90, message: 'Latitude must be >= -90' },
      max: { value: 90, message: 'Latitude must be <= 90' },
    })
    register('longitude', {
      required: 'Longitude is required',
      min: { value: -180, message: 'Longitude must be >= -180' },
      max: { value: 180, message: 'Longitude must be <= 180' },
    })
  }, [register])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            placeholder="Central Warehouse"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Code */}
        <div className="space-y-2">
          <Label htmlFor="code">
            Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="code"
            {...register('code', { required: 'Code is required' })}
            placeholder="WH-001"
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Main distribution center..."
            rows={2}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Location</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">
              Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address"
              {...register('address', { required: 'Address is required' })}
              placeholder="123 Main St"
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              {...register('city', { required: 'City is required' })}
              placeholder="Warsaw"
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              {...register('state')}
              placeholder="Mazowieckie"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">
              Country <span className="text-destructive">*</span>
            </Label>
            <Input
              id="country"
              {...register('country', { required: 'Country is required' })}
              placeholder="Poland"
            />
            {errors.country && (
              <p className="text-sm text-destructive">
                {errors.country.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">
              Postal Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="postalCode"
              {...register('postalCode', {
                required: 'Postal code is required',
              })}
              placeholder="00-001"
            />
            {errors.postalCode && (
              <p className="text-sm text-destructive">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Coordinates</h3>
        <div className="space-y-2">
          <Label>
            Location <span className="text-destructive">*</span>
          </Label>
          <CoordinateSelector
            latitude={watch('latitude')}
            longitude={watch('longitude')}
            address={watch('address')}
            city={watch('city')}
            country={watch('country')}
            onSelect={(lat, lng) => {
              setValue('latitude', lat, { shouldValidate: true })
              setValue('longitude', lng, { shouldValidate: true })
            }}
          />
          {(errors.latitude || errors.longitude) && (
            <p className="text-sm text-destructive">
              {errors.latitude?.message || errors.longitude?.message}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Contact Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactName">
              Contact Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactName"
              {...register('contactName', {
                required: 'Contact name is required',
              })}
              placeholder="John Doe"
            />
            {errors.contactName && (
              <p className="text-sm text-destructive">
                {errors.contactName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              Contact Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              {...register('contactEmail', {
                required: 'Contact email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="contact@warehouse.com"
            />
            {errors.contactEmail && (
              <p className="text-sm text-destructive">
                {errors.contactEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contactPhone">
              Contact Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactPhone"
              {...register('contactPhone', {
                required: 'Contact phone is required',
              })}
              placeholder="+48 22 123 4567"
            />
            {errors.contactPhone && (
              <p className="text-sm text-destructive">
                {errors.contactPhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {warehouse ? 'Update Warehouse' : 'Create Warehouse'}
        </Button>
      </div>
    </form>
  )
}
