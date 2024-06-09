import { ComponentProps } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icon } from '@/components/Icons'

export interface InfoCardProps extends ComponentProps<typeof Card> {
  title: string
  description: string
  Icon: Icon
  href?: string
}

export function InfoCard({
  className,
  title,
  description,
  Icon,
  href,
  ...props
}: InfoCardProps) {
  const cardContent = (
    <>
      <CardHeader className="pb-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Icon className="size-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-pretty text-card-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        target={href.startsWith('https://') ? '_blank' : undefined}
        className="flex flex-col rounded-lg bg-white shadow-sm transition-opacity hover:opacity-75"
      >
        <Card className={cn('', className)} {...props}>
          {cardContent}
        </Card>
      </Link>
    )
  }

  return (
    <Card className={cn('', className)} {...props}>
      {cardContent}
    </Card>
  )
}
