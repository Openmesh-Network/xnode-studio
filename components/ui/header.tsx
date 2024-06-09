import React from 'react'

import { cn } from '@/lib/utils'

interface HeaderProps
  extends React.PropsWithChildren<
    Omit<React.HTMLAttributes<HTMLHeadingElement>, 'level'>
  > {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const Header = ({ className, children, level = 1, ...props }: HeaderProps) => {
  const headerClasses = [
    'text-5xl font-semibold leading-10',
    'text-2xl font-semibold leading-6',
    'text-xl font-semibold',
    'text-lg font-semibold',
    'text-base font-semibold',
    'text-sm font-semibold',
  ]

  const headerTag = `h${level}`

  // returns a header tag with the appropriate level (h1, h2, etc.), the appropriate class, the rest of the props and the children

  return React.createElement(
    headerTag,
    { className: cn(headerClasses[level - 1], className), ...props },
    children
  )
}

export default Header
