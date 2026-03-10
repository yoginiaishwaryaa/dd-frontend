import { Link } from 'react-router-dom'
import { CaretRight, House } from '@phosphor-icons/react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-1 text-sm ${className}`} aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="text-deep-navy/50 hover:text-deep-navy transition-colors flex items-center gap-1"
      >
        <House className="size-4" weight="duotone" />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <CaretRight className="size-3 text-deep-navy/30" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-deep-navy/50 hover:text-deep-navy transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-deep-navy/80 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
