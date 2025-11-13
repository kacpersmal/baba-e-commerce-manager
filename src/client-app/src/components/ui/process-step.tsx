import type { ComponentType } from 'react'

export interface ProcessStepProps {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
  showArrow?: boolean
}

export function ProcessStep({
  icon: Icon,
  title,
  description,
  color,
  showArrow = false,
}: ProcessStepProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg">
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      {showArrow && (
        <div className="absolute -right-4 top-8 hidden text-4xl text-muted-foreground/30 lg:block">
          →
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

