import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'

interface QuickLinkProps {
  to: string
  icon?: React.ElementType
  children: React.ReactNode
  description?: string
  external?: boolean
  className?: string
}

export function QuickLink({
  to,
  icon: Icon,
  children,
  description,
  external = false,
  className = '',
}: QuickLinkProps) {
  const linkClasses = `
    group flex items-center gap-3 p-3 rounded-lg
    bg-deep-navy/5 hover:bg-deep-navy/10 
    border border-deep-navy/10 hover:border-deep-navy/20
    transition-all duration-200
    ${className}
  `

  const content = (
    <>
      {Icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-ocean-city/20 flex items-center justify-center">
          <Icon className="size-5 text-ocean-city" weight="duotone" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="font-medium text-deep-navy group-hover:text-ocean-city transition-colors">
          {children}
        </span>
        {description && (
          <p className="text-xs text-deep-navy/50 mt-0.5 truncate">{description}</p>
        )}
      </div>
      <ArrowRight className="size-4 text-deep-navy/30 group-hover:text-deep-navy/60 group-hover:translate-x-1 transition-all" />
    </>
  )

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={to} className={linkClasses}>
      {content}
    </Link>
  )
}
