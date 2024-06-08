import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export interface SectionProps extends ComponentProps<'section'> {
  // Props definition here
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn('p-12', className)} {...props}>
      {children}
    </section>
  )
}
