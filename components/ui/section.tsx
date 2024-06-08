import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
  fullWidth?: boolean
}

export function Section({
  className,
  children,
  fullWidth = false,
  asChild = false,
  ...props
}: SectionProps) {
  const Comp = asChild ? Slot : 'section'
  return (
    <Comp
      className={cn(fullWidth ? 'w-full' : 'container', className)}
      {...props}
    >
      {children}
    </Comp>
  )
}
