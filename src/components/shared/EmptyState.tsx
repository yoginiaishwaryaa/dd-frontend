import { Link } from 'react-router-dom'
import { Button } from '@/components/shadcn/button'

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    external?: boolean
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Icon className="size-8 text-white/30" weight="duotone" />
      </div>
      <h3 className="text-lg font-medium text-white/80">{title}</h3>
      {description && (
        <p className="text-sm text-white/50 mt-1 max-w-sm">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action.href ? (
            action.external ? (
              <a href={action.href} target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary-delta">{action.label}</Button>
              </a>
            ) : (
              <Link to={action.href}>
                <Button className="btn-primary-delta">{action.label}</Button>
              </Link>
            )
          ) : (
            <Button className="btn-primary-delta" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
