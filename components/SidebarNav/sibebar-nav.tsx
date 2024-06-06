'use client'

import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Icon, Icons } from '@/components/Icons'

interface SidebarNav {
  isMobile?: boolean
  className?: string
}

const SidebarNav: React.FC<SidebarNav> = ({
  isMobile = false,
  className = '',
}) => {
  return (
    <NavContainer className={className}>
      {/* <NavHeader isMobile={isMobile}></NavHeader> */}
      <NavContent className="mt-0 overflow-y-scroll pb-2">
        <NavCategory label="Studio">
          <NavLink
            href="/"
            icon={Icons.HomeIcon}
            label="Home"
            isMobile={isMobile}
          />
          <NavLink
            href="/dashboard"
            icon={Icons.DashboardIcon}
            label="Dashboard"
            isMobile={isMobile}
          />
          <NavLink
            href="/deployments"
            icon={Icons.DeploymentsIcon}
            label="deployments"
            isMobile={isMobile}
            isSoon
          />
          <NavLink
            href="/resources"
            icon={Icons.ResourcesIcon}
            label="Resources"
            isMobile={isMobile}
          />
        </NavCategory>
        <NavSeperator />

        <NavLink
          href="/xnode"
          icon={Icons.XNodeIcon}
          label="Xnode"
          isMobile={isMobile}
          isSoon
        />
        <NavSeperator />

        <NavLink
          href="/template-products"
          icon={Icons.Templates}
          label="Templates"
          isMobile={isMobile}
        />
        <NavLink
          href="/workspace"
          icon={Icons.DesignAndBuildIcon}
          label="Design & Build"
          isMobile={isMobile}
          tag="Beta"
        />
        <NavSeperator />

        <NavLink
          href="/data-products"
          icon={Icons.DataIcon}
          label="Data"
          isMobile={isMobile}
        />
        <NavLink
          href="/compute"
          icon={Icons.ComputeIcon}
          label="Compute"
          isMobile={isMobile}
          isSoon
        />
        <NavLink
          href="/storage"
          icon={Icons.StorageIcon}
          label="Storage"
          isMobile={isMobile}
          isSoon
        />
        <NavLink
          href="/analytics"
          icon={Icons.AnalyticsIcon}
          label="Analytics"
          isMobile={isMobile}
          isSoon
        />
        <NavLink
          href="/rpc"
          icon={Icons.RPCIcon}
          label="RPC"
          isMobile={isMobile}
          isSoon
        />
        <NavLink
          href="/apis"
          icon={Icons.APIIcon}
          label="APIs"
          isMobile={isMobile}
          isSoon
        />
        <NavLink
          href="/appdev"
          icon={Icons.AppDevIcon}
          label="App Dev"
          isMobile={isMobile}
          isSoon
        />
        <NavLink
          href="/integrations"
          icon={Icons.IntegrationsIcon}
          label="Integrations"
          isMobile={isMobile}
          isSoon
        />
        <NavLink
          href="/utility"
          icon={Icons.UtilityIcon}
          label="Utility"
          isMobile={isMobile}
          isSoon
        />
        <NavCategory label="Studio">
          <NavLink
            href="/trading"
            icon={Icons.TradingIcon}
            label="Trading"
            isMobile={isMobile}
            isSoon
          />
          <NavLink
            href="/machine-learning"
            icon={Icons.MachineLearningIcon}
            label="AI & Machine Learning"
            isMobile={isMobile}
            isSoon
          />
        </NavCategory>
        <NavCategory label="Pages">
          <NavLink
            href="/profile"
            icon={Icons.ProfileIcon}
            label="Profile"
            isMobile={isMobile}
          />
          <NavLink
            href="/staking"
            icon={Icons.StakingIcon}
            label="Staking & Reward Claiming"
            isMobile={isMobile}
            isSoon
          />
          <NavLink
            href="/settings"
            icon={Icons.SettingsIcon}
            label="settings"
            isMobile={isMobile}
            isSoon
          />
          <NavLink
            href="/faq"
            icon={Icons.FAQIcon}
            label="FAQs"
            isMobile={isMobile}
            isSoon
          />
        </NavCategory>
        <NavCategory label="Support">
          <NavLink
            href="/docs"
            icon={Icons.DocumentationIcon}
            label="Documentation"
            isMobile={isMobile}
          />
          <NavLink
            href="/community"
            icon={Icons.CommunityIcon}
            label="Commmunity"
            isMobile={isMobile}
            isSoon
          />
          <NavLink
            href="/circle"
            icon={Icons.CircleIcon}
            label="Circle"
            isMobile={isMobile}
            isSoon
          />
        </NavCategory>
      </NavContent>

      <NavFooter></NavFooter>
    </NavContainer>
  )
}

const NavLayout: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className,
}) => {
  return (
    <TooltipProvider>
      <div className={cn('flex', className)}>
        <SidebarNav className="hidden lg:block" />
        <main className="mt-16 flex-1">{children}</main>
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
          'duration-plico sticky top-0 flex h-screen shrink-0 flex-col justify-between border-r bg-card pt-16 text-card-foreground transition-[width] ease-in-out',
          collapsed ? 'w-14' : 'w-56',
          className
        )}
        ref={ref}
        {...props}
      >
        <nav className="flex h-full flex-col justify-between">{children}</nav>
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

      <SheetContent side={'left'} className="w-56 p-0">
        <SidebarNav isMobile />
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

const NavContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
}) => {
  return (
    <ul className={cn('relative mt-8 flex w-full flex-col', className)}>
      {children}
    </ul>
  )
}

const NavFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
}) => {
  return (
    <ul className={cn('relative mt-auto flex w-full flex-col', className)}>
      {children}
    </ul>
  )
}

type RootNavLinksProps = NavLinkProps

interface NavCategoryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  icon?: Icon
}

const NavCategory = React.forwardRef<HTMLDivElement, NavCategoryItemProps>(
  ({ className, label, icon, children, ...props }, ref) => {
    const { collapsed } = useNavContext()

    return (
      <div ref={ref} className={cn('mt-3', className)} {...props}>
        {label && (
          <p
            className={cn(
              'duration-plico ml-3 truncate text-xs font-medium uppercase text-foreground/80 transition-opacity ease-in-out',
              collapsed ? 'opacity-0' : 'opacity-100'
            )}
          >
            {label}
          </p>
        )}
        <nav className="flex flex-col">{children}</nav>
      </div>
    )
  }
)
NavCategory.displayName = 'NavCategory'

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
            <Icon className="relative z-10 size-5 shrink-0" />
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

interface NavLinkProps {
  href: string
  icon: Icon
  label: string
  isMobile?: boolean
  isSoon?: boolean
  tag?: string
  className?: string
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isMobile = false,
  isSoon = false,
  className,
  tag = '',
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
    <li className={cn('relative hover:bg-red-500', className)}>
      {isActive && (
        <motion.span
          layoutId={`${isMobile} bubble`}
          className={
            'absolute inset-0 z-10 w-full border-l-4 border-primary bg-primary/10'
          }
          transition={{
            duration: transitionDuration,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      )}
      <Tooltip open={!collapsed ? false : undefined} delayDuration={500}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className="flex h-10 items-center rounded-md px-3 py-2 text-foreground hover:bg-accent/30"
          >
            <div className="flex items-center">
              <div className="relative">
                {tag && collapsed && (
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
                <Icon className="relative z-10 size-5 shrink-0" />
              </div>
              <span
                className={cn(
                  'duration-plico relative z-10 ml-4 w-32 max-w-full truncate text-sm opacity-100 transition-[margin,max-width,opacity] ease-in-out',
                  collapsed &&
                    'ml-0 max-w-0 opacity-0 group-[.category]:ml-4 group-[.category]:max-w-full group-[.category]:opacity-100'
                )}
              >
                {label}
              </span>
            </div>
            {tag && !collapsed && (
              <motion.div
                layoutId={`${label} ${isMobile} notification`}
                className="absolute right-0 top-1/4 z-10 mr-2 inline-flex -translate-y-1/4 items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white"
                transition={{
                  duration: transitionDuration,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  borderRadius: '8px 0px 8px 0px ',
                }}
              >
                {tag}
              </motion.div>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </li>
  )
}

interface SeperatorProps extends React.HTMLAttributes<HTMLElement> {
  label?: string
  border?: boolean
}

const NavSeperator: React.FC<SeperatorProps> = ({
  label: title,
  border = false,
  className,
  ...props
}) => {
  const { collapsed } = useNavContext()

  return (
    <li
      className={cn(
        'relative z-20 h-px w-full',
        border && 'bg-border',
        title ? 'mt-6' : 'mt-3',
        className
      )}
      {...props}
    >
      {title && (
        <p
          className={cn(
            'duration-plico absolute inset-0 flex w-fit items-center bg-card px-3 text-xs uppercase text-card-foreground transition-[width,opacity] ease-in-out',
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
