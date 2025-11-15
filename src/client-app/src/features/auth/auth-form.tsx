import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FieldDescription } from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import LoginForm from './auth-login-form'
import RegisterForm from './auth-signup-form'
import { Button } from '@/components/ui/button'
import { useAuthModalStore } from './useAuthStore'

export default function AuthForm({ className }: React.ComponentProps<'div'>) {
  const [registerFlag, setRegisterFlag] = useState(false)
  const toggleModal = useAuthModalStore((s) => s.toggleAuthModal)
  return (
    <div className={cn('flex flex-col gap-6 ', className)}>
      <Card className="overflow-hidden  p-0 shadow-2xl/80 ">
        <CardContent className="grid p-0 md:grid-cols-2  ">
          {!registerFlag ? (
            <AnimatePresence>
              <motion.div
                className="p-6 flex flex-col"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <LoginForm hanldeRegisterFlag={setRegisterFlag} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="my-auto p-6 "
            >
              <RegisterForm handleRegisterFlag={setRegisterFlag} />
            </motion.div>
          )}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/paprocie.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
            />
            <p className="z-10 absolute bottom-3 text-secondary gap-1 w-full flex items-center justify-center">
              Photo by
              <a href="https://unsplash.com/@a_d_s_w" target="_blank">
                {' Adrian Swancar '}
              </a>
            </p>
            <Button
              variant="secondary"
              className="z-10 absolute top-5 right-5 text-primary"
              onClick={toggleModal}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
