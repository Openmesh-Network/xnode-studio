import { ComponentProps, ReactElement } from 'react'

interface LateralNavListItemProps extends ComponentProps<'div'> {
  isActive: boolean
  icon: ReactElement
  label: string
}

export function LateralNavListItem({
  icon,
  isActive,
  label,
}: LateralNavListItemProps) {
  return (
    <div
      className={`relative flex h-12 w-full items-center ${
        isActive ? 'bg-[#E5EEFC]' : 'bg-transparent'
      }`}
    >
      {isActive ? (
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue500" />
      ) : null}
      <div className="flex items-center gap-x-3 px-6">
        {icon}
        <strong
          className={
            isActive
              ? 'text-sm font-bold text-darkGray'
              : 'text-sm font-medium text-darkGray'
          }
        >
          {label}
        </strong>
      </div>
    </div>
  )
}
