import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export interface FAQItemProps {
  question: string
  answer: string
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl border transition-all duration-300
        ${
          isOpen
            ? 'border-white/30 bg-white/10 shadow-lg shadow-white/5'
            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
        }
        backdrop-blur-md
      `}
    >
      <div
        className={`
          absolute inset-0 bg-linear-to-r from-white/5 via-white/10 to-white/5 opacity-0 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'group-hover:opacity-50'}
        `}
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex w-full items-start gap-4 p-5 text-left"
      >
        <div
          className={`
            mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300
            ${
              isOpen
                ? 'border-white/30 bg-white/20 text-foreground'
                : 'border-white/20 bg-white/5 text-muted-foreground group-hover:border-white/30 group-hover:text-foreground'
            }
          `}
        >
          <HelpCircle className="h-4 w-4" />
        </div>

        <div className="flex-1 space-y-1">
          <h3
            className={`
              text-base font-semibold transition-colors duration-300
              ${isOpen ? 'text-foreground' : 'text-foreground group-hover:text-foreground'}
            `}
          >
            {question}
          </h3>
        </div>

        <div
          className={`
            mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300
            ${
              isOpen
                ? 'rotate-180 bg-white/20 text-foreground'
                : 'bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground'
            }
          `}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>
      <div
        className={`
          grid transition-all duration-300
          ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
        `}
      >
        <div className="overflow-hidden">
          <div className="relative border-t border-white/10 px-5 pb-5 pt-4">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
