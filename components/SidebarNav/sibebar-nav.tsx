'use client'

import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { useProject } from '@/lib/providers/project-provider'
import { User, useUser } from '@/lib/providers/user-provider'
import { request } from '@/lib/request'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import GradientAvatar from '@/components/gradient-avatar'
import { Icon, Icons } from '@/components/icons'
import { ProjectSelector } from '@/components/project-switcher'

interface Nav {
  isMobile?: boolean
  className?: string
}

const Nav: React.FC<Nav> = ({ isMobile = false, className = '' }) => {
  const { projectId } = useProject()
  const router = useRouter()
  const { refetch } = useUser()

  return (
    <NavContainer className={className}>
      <NavHeader isMobile={isMobile}>
        <NavLogo />
      </NavHeader>
      <ProjectSelector className="mt-4" />
      <NavContent>
        <NavLink
          href={`/${projectId}/collection`}
          icon={Icons.Collections}
          label="Lead collections"
          isMobile={isMobile}
        />
        <NavLink
          href={`/${projectId}/accounts`}
          icon={Icons.Accounts}
          label="Accounts"
          isMobile={isMobile}
        />
        <NavLink
          href={`/${projectId}/settings`}
          icon={Icons.Settings}
          label="Project settings"
          isMobile={isMobile}
        />
      </NavContent>
      <NavFooter>
        <NavThemeToggle />
        <NavButton
          icon={Icons.Logout}
          label="Log out"
          onClick={async () => {
            toast.promise(request.post('/api/auth/logout', {}), {
              loading: 'Logging out...',
              success: 'Logged out',
              error: (e) => e.message || 'Failed to log out',
            })
            await request.post('/api/auth/logout', {})
            refetch()
          }}
        />
        <NavProfile />
      </NavFooter>
    </NavContainer>
  )
}

const getLogo = (user: User | null) => {
  switch (user?.agency) {
    case 'Borks':
      return Icons.Borks
    case 'InfiniteBookings':
      return Icons.Infinite
    default:
      return Icons.Logo
  }
}

const NavLogo: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { user } = useUser()
  const Logo = getLogo(user)

  return (
    <div className="flex items-center gap-x-2 p-2" {...props}>
      <Logo className="size-8 shrink-0 rounded-md" />
      <p className="font-bold">AutoReach</p>
    </div>
  )
}

const NavLayout: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className,
}) => {
  return (
    <TooltipProvider>
      <div className={cn('flex h-screen w-screen', className)}>
        <Nav className="hidden lg:block" />
        <div className="w-full overflow-y-auto">
          <main>{children}</main>
        </div>
      </div>
    </TooltipProvider>
  )
}

const NavContext = React.createContext<{
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}>({
  collapsed: false,
  setCollapsed: () => {},
})

/**
 * Hook to get the collapsed state and setCollapsed function for the nav sidebar
 * @returns [collapsed, setCollapsed]
 */
export const useNavContext = () => useContext(NavContext)

const NavContainer = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  const [collapsed, setCollapsed] = useState(false)

  // Load collapsed state from local storage
  useEffect(() => {
    const stored = localStorage.getItem('nav-collapsed')
    if (stored === 'true') setCollapsed(true)
  }, [])

  // Controlled state of Accordion and NavigationMenu components
  const [accordionValue, setAccordionValue] = useState([])
  const [accordionValuePrev, setAccordionValuePrev] = useState([])

  useEffect(() => {
    if (collapsed) {
      setAccordionValuePrev(accordionValue)
      setAccordionValue([])
    } else setAccordionValue(accordionValuePrev)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed])

  return (
    <NavContext.Provider
      value={{
        collapsed,
        setCollapsed,
      }}
    >
      <aside
        className={cn(
          'duration-plico flex h-screen shrink-0 flex-col justify-between bg-card p-3 text-card-foreground shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] transition-[width] ease-in-out dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)]',
          collapsed ? 'w-[4.5rem]' : 'w-[15.5rem]',
          className
        )}
        ref={ref}
        {...props}
      >
        <nav className="flex h-full flex-col">{children}</nav>
      </aside>
    </NavContext.Provider>
  )
})
NavContainer.displayName = 'NavContainer'

const NavMobileTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { collapsed, setCollapsed } = useNavContext()

  const toggleCollapsed = () => {
    localStorage.setItem('nav-collapsed', false.toString())
    setCollapsed(false)
  }

  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button
          variant="outline"
          size={'icon'}
          className={cn('p-2', className)}
          onClick={toggleCollapsed}
        >
          <NavCollapseIcon forcedCollapsed />
        </Button>
      </SheetTrigger>

      <SheetContent side={'left'} className="w-[15.5rem] p-0">
        <Nav isMobile />
      </SheetContent>
    </Sheet>
  )
}

const NavHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { isMobile?: boolean }
> = ({ isMobile, ...props }) => {
  const { collapsed, setCollapsed } = useNavContext()

  const toggleCollapsed = () => {
    localStorage.setItem('nav-collapsed', (!collapsed).toString())
    setCollapsed(!collapsed)
  }

  return (
    <div className="duration-plico relative flex h-10 w-full items-center">
      <div
        className={cn(
          'duration-plico flex grow items-center gap-x-2 overflow-hidden whitespace-nowrap text-lg transition-[max-width,opacity,padding] ease-in-out',
          collapsed ? 'max-w-0 pl-0 opacity-0' : 'max-w-full pl-0 opacity-100'
        )}
        {...props}
      />
      {!isMobile && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleCollapsed}
              className="inline-flex h-10 items-center justify-center rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <NavCollapseIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? 'Expand' : 'Collapse'} sidebar
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

interface NavCollapseIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  forcedCollapsed?: boolean
}

const NavCollapseIcon: React.FC<NavCollapseIconProps> = ({
  forcedCollapsed = false,
  ...props
}) => {
  const { collapsed } = useNavContext()
  const isCollapsed = forcedCollapsed ? forcedCollapsed : collapsed

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={'shrink-0'}
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="15" x2="15" y1="3" y2="21" />
      <path
        className={cn(
          isCollapsed ? 'rotate-0' : 'rotate-180',
          'duration-plico transition-transform ease-in-out'
        )}
        style={{ transformOrigin: '40%' }}
        d="m8 9 3 3-3 3"
      />
    </svg>
  )
}

export function NavThemeToggle({}: ButtonProps) {
  const { setTheme } = useTheme()

  const { collapsed } = useNavContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <li className="relative">
          <Tooltip open={!collapsed ? false : undefined} delayDuration={500}>
            <TooltipTrigger asChild>
              <button className="flex h-12 w-full items-center rounded-md p-3 hover:bg-accent/30">
                <div className="flex items-center">
                  <Icons.Sun className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Icons.Moon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />{' '}
                  <span
                    className={cn(
                      'duration-plico relative z-10 ml-4 w-32 max-w-full truncate text-left text-base opacity-100 transition-[margin,max-width,opacity] ease-in-out',
                      collapsed &&
                        'ml-0 max-w-0 opacity-0 group-[.category]:ml-4 group-[.category]:max-w-full group-[.category]:opacity-100'
                    )}
                  >
                    Toggle theme
                  </span>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle theme</TooltipContent>
          </Tooltip>
        </li>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const NavContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  return <ul className="relative mt-8 w-full space-y-2">{children}</ul>
}

const NavFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  return <ul className="relative mt-auto w-full space-y-2">{children}</ul>
}

type RootNavLinksProps = NavLinkProps

interface NavCategoryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  icon?: Icon
  links: RootNavLinksProps[]
}

const NavCategory = React.forwardRef<HTMLDivElement, NavCategoryItemProps>(
  ({ className, label, icon, links, ...props }, ref) => {
    const { collapsed } = useNavContext()

    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {label && (
          <p
            className={cn(
              'duration-plico ml-3 truncate text-sm font-medium text-foreground/80 transition-opacity ease-in-out',
              collapsed ? 'opacity-0' : 'opacity-100'
            )}
          >
            {label}
          </p>
        )}
        <nav className="flex flex-col gap-y-1.5">
          {links.map((link, i) => (
            <NavLink key={i} {...link} />
          ))}
        </nav>
      </div>
    )
  }
)
NavCategory.displayName = 'NavCategory'

interface NavLinkProps {
  href: string
  icon: Icon
  label: string
  isMobile?: boolean
  notifications?: number
}

interface NavButtonProps extends ButtonProps {
  icon: Icon
  label: string
}

const NavButton: React.FC<NavButtonProps> = ({
  icon: Icon,
  label,
  ...props
}) => {
  const { collapsed } = useNavContext()

  const transitionDuration = 0.5
  return (
    <li className="relative">
      <Tooltip open={!collapsed ? false : undefined} delayDuration={500}>
        <TooltipTrigger asChild>
          <button
            className="flex h-12 w-full items-center rounded-md p-3 hover:bg-accent/30"
            {...props}
          >
            <Icon className="relative z-10 size-6 shrink-0" />
            <span
              className={cn(
                'duration-plico relative z-10 ml-4 w-32 max-w-full truncate text-left text-base opacity-100 transition-[margin,max-width,opacity] ease-in-out',
                collapsed &&
                  'ml-0 max-w-0 opacity-0 group-[.category]:ml-4 group-[.category]:max-w-full group-[.category]:opacity-100'
              )}
            >
              {label}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </li>
  )
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isMobile = false,
  notifications = 0,
}) => {
  const { collapsed } = useNavContext()

  const pathname = usePathname()
  let isActive: boolean
  if (href === '/') {
    isActive = pathname === href || pathname.startsWith('/collection')
  } else {
    isActive = pathname.startsWith(href)
  }

  const transitionDuration = 0.5
  return (
    <li className="relative">
      <Tooltip open={!collapsed ? false : undefined} delayDuration={500}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className="flex h-12 items-center rounded-md p-3 text-foreground hover:bg-accent/30"
          >
            {isActive && (
              <motion.span
                layoutId={`${isMobile} bubble`}
                className={
                  'absolute inset-0 z-0 w-full bg-accent/50 bg-gradient-to-l from-primary/10 to-50%'
                }
                style={{ borderRadius: 6 }}
                transition={{
                  duration: transitionDuration,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            )}
            <div className="flex items-center">
              <div className="relative">
                {notifications > 0 && collapsed && (
                  <motion.div
                    layoutId={`${label} ${isMobile} notification`}
                    className="absolute right-0 top-0 z-20 size-2 rounded-full bg-primary"
                    style={{
                      borderRadius: 9999,
                    }}
                    transition={{
                      duration: transitionDuration,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                )}
                <Icon className="relative z-10 size-6 shrink-0" />
              </div>
              <span
                className={cn(
                  'duration-plico relative z-10 ml-4 w-32 max-w-full truncate text-base opacity-100 transition-[margin,max-width,opacity] ease-in-out',
                  collapsed &&
                    'ml-0 max-w-0 opacity-0 group-[.category]:ml-4 group-[.category]:max-w-full group-[.category]:opacity-100'
                )}
              >
                {label}
              </span>
            </div>
            {notifications > 0 && !collapsed && (
              <motion.div
                layoutId={`${label} ${isMobile} notification`}
                className="absolute right-0 z-10 mr-2 inline-flex items-center rounded-full border border-primary px-2 py-0.5 font-mono text-xs text-card-foreground/80"
                transition={{
                  duration: transitionDuration,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  borderRadius: 9999,
                }}
              >
                {notifications > 0 && notifications < 100
                  ? notifications
                  : '99+'}
              </motion.div>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </li>
  )
}

const NavProfile = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { collapsed } = useNavContext()
  const { user } = useUser()

  return (
    <Card
      className={cn(
        'duration-plico flex items-center gap-x-2 p-2 transition-[opacity,padding] ease-in-out',
        collapsed
          ? 'border-border/0 pl-1 shadow-transparent dark:shadow-none'
          : 'border-border/100 pl-2'
      )}
      ref={ref}
      {...props}
    >
      <div className="size-10">
        <GradientAvatar
          text={user?.username ?? 'A'}
          className="aspect-square size-10 overflow-hidden rounded-full"
        />
      </div>
      <div
        className={cn(
          collapsed ? 'w-0 opacity-0' : 'w-full opacity-100',
          'duration-plico truncate leading-tight transition-[width,opacity] ease-in-out'
        )}
      >
        <p className="truncate font-semibold">{user?.username}</p>
        <p className="truncate text-sm text-foreground/70">{user?.agency}</p>
      </div>
    </Card>
  )
})
NavProfile.displayName = 'ProfileCard'

interface SeperatorProps extends React.HTMLAttributes<HTMLElement> {
  label?: string
}

const NavSeperator: React.FC<SeperatorProps> = ({
  label: title,
  className,
  ...props
}) => {
  const { collapsed } = useNavContext()

  return (
    <li
      className={cn(
        'relative z-20 my-1.5 h-px w-full bg-border',
        title && 'mt-4',
        className
      )}
      {...props}
    >
      {title && (
        <p
          className={cn(
            'duration-plico absolute inset-0 flex w-fit items-center bg-card pl-1 pr-3 text-lg capitalize text-card-foreground transition-[width,opacity] ease-in-out',
            collapsed && 'w-0 opacity-0'
          )}
        >
          {title}
        </p>
      )}
    </li>
  )
}

export { NavLayout, NavMobileTrigger }
