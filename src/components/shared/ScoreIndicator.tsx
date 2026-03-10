import { cn } from '@/lib/utils'

interface ScoreIndicatorProps {
  score: number | null
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

function getScoreColor(score: number): string {
  if (score < 0.3) return 'text-green-600'
  if (score < 0.5) return 'text-yellow-600'
  if (score < 0.7) return 'text-amber-600'
  if (score < 0.85) return 'text-orange-600'
  return 'text-red-600'
}

function getScoreLabel(score: number): string {
  if (score < 0.3) return 'Low'
  if (score < 0.5) return 'Medium'
  if (score < 0.7) return 'High'
  if (score < 0.85) return 'Critical'
  return 'Severe'
}

function getScoreBgColor(score: number): string {
  if (score < 0.3) return 'bg-green-500'
  if (score < 0.5) return 'bg-yellow-500'
  if (score < 0.7) return 'bg-amber-500'
  if (score < 0.85) return 'bg-orange-500'
  return 'bg-red-500'
}

export function ScoreIndicator({ score, size = 'md', showLabel = true, className }: ScoreIndicatorProps) {
  if (score === null || score === undefined) {
    return (
      <span className={cn('text-gray-400 font-mono', className)}>
        —
      </span>
    )
  }

  const percentage = Math.round(score * 100)
  const colorClass = getScoreColor(score)
  const bgColorClass = getScoreBgColor(score)
  const label = getScoreLabel(score)

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const barWidth = {
    sm: 'w-12',
    md: 'w-16',
    lg: 'w-20',
  }

  const barHeight = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Progress bar */}
      <div className={cn('rounded-full bg-gray-200 overflow-hidden', barWidth[size], barHeight[size])}>
        <div 
          className={cn('h-full rounded-full transition-all', bgColorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Score value */}
      <span className={cn('font-mono font-medium', colorClass, sizeClasses[size])}>
        {score.toFixed(2)}
      </span>
      
      {/* Label */}
      {showLabel && (
        <span className={cn('font-medium', colorClass, sizeClasses[size])}>
          ({label})
        </span>
      )}
    </div>
  )
}
