import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import type { Dispatch, SetStateAction } from 'react'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import { Button } from '../../components/ui/button'

export default function RegisterForm({
  handleRegisterFlag,
}: {
  handleRegisterFlag: Dispatch<SetStateAction<boolean>>
}) {
  const signUpSchema = z
    .object({
      email: z.email(),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .max(40, 'Password must be at most 40 characters.'),
      confirmPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .max(40, 'Password must be at most 40 characters.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: signUpSchema,
    },
  })
  return (
    <div className="">
      <form
        className="p-6 flex items-center min-h-[670px]  "
        id="loginForm"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup className="">
          <div className="flex flex-col items-center gap-2 text-center ">
            <h1 className="text-2xl font-bold">Sing Up</h1>
            <p className="text-muted-foreground text-balance">
              Create an account
            </p>
          </div>
          {/* EMAIL FORM FIELD */}
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid} className="">
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
          {/* PASSWORD FORM FIELD  */}
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="password"
                    placeholder="******"
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
          <form.Field
            name="confirmPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor={field.name}>
                      Confirm your password
                    </FieldLabel>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="password"
                    placeholder="******"
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Submit FIELD */}
          <Field>
            <Button type="submit">Continue</Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card"></FieldSeparator>

          <FieldDescription className="text-center">
            Have an account?{' '}
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault()
                handleRegisterFlag(false)
              }}
            >
              Sign in
            </Button>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}
