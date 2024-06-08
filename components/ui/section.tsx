import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

export function Section({
  className,
  children,
  asChild = false,
  ...props
}: SectionProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn('container', className)} {...props}>
      {children}
    </Comp>
  )
}
