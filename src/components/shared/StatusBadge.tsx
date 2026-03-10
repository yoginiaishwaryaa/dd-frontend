import { cn } from '@/lib/utils'
import type { ProcessingPhase, DriftResult } from '@/types/drift'

interface StatusBadgeProps {
  status: ProcessingPhase | DriftResult
  size?: 'sm' | 'md'
  className?: string
}

// Phase styling
const phaseStyles: Record<ProcessingPhase, string> = {
  queued: 'bg-gray-500 text-white border-gray-600',
  scouting: 'bg-blue-500 text-white border-blue-600 animate-pulse',
  analyzing: 'bg-blue-500 text-white border-blue-600 animate-pulse',
  generating: 'bg-amber-500 text-white border-amber-600 animate-pulse',
  verifying: 'bg-cyan-600 text-white border-cyan-700 animate-pulse',
  fix_pr_raised: 'bg-indigo-500 text-white border-indigo-600',
  fix_pr_merged: 'bg-purple-500 text-white border-purple-600',
  completed: 'bg-green-500 text-white border-green-600',
  failed: 'bg-red-500 text-white border-red-600',
}

// Result styling
const resultStyles: Record<DriftResult, string> = {
  pending: 'bg-gray-500/20 text-gray-300 border-gray-500',
  clean: 'bg-green-500/20 text-green-300 border-green-400',
  drift_detected: 'bg-amber-500/20 text-amber-300 border-amber-400',
  missing_docs: 'bg-orange-500/20 text-orange-300 border-orange-400',
  error: 'bg-red-500/20 text-red-300 border-red-400',
}

// Labels
const phaseLabels: Record<ProcessingPhase, string> = {
  queued: 'Queued',
  scouting: 'Scouting',
  analyzing: 'Analyzing',
  generating: 'Generating',
  verifying: 'Verifying',
  fix_pr_raised: 'PR Raised',
  fix_pr_merged: 'PR Merged',
  completed: 'Analysis Completed',
  failed: 'Failed',
}

const resultLabels: Record<DriftResult, string> = {
  pending: 'Pending',
  clean: 'Clean',
  drift_detected: 'Drift Detected',
  missing_docs: 'Missing Docs',
  error: 'Error',
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  if (status === 'clean') return null

  // Determine if it's a phase or result
  const isPhase = status in phaseStyles
  const styles = isPhase ? phaseStyles[status as ProcessingPhase] : resultStyles[status as DriftResult]
  const label = isPhase ? phaseLabels[status as ProcessingPhase] : resultLabels[status as DriftResult]

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-sm px-2.5 py-1'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        styles,
        sizeClasses,
        className
      )}
    >
      {label}
    </span>
  )
}
