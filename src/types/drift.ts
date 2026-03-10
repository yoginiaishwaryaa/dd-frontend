// Processing phases (matches backend check constraint)
export type ProcessingPhase =
  | 'queued'
  | 'scouting'
  | 'analyzing'
  | 'generating'
  | 'verifying'
  | 'fix_pr_raised'
  | 'fix_pr_merged'
  | 'completed'
  | 'failed'

// Drift analysis results
export type DriftResult =
  | 'pending'
  | 'clean'
  | 'drift_detected'
  | 'missing_docs'
  | 'error'

// Drift finding types
export type DriftType = 'outdated_docs' | 'missing_docs' | 'ambiguous_docs'

// Change types
export type ChangeType = 'added' | 'modified' | 'deleted'

// Drift event from API (list view - minimal data)
export interface DriftEvent {
  id: string
  pr_number: number
  base_branch: string
  head_branch: string
  processing_phase: ProcessingPhase
  drift_result: DriftResult
  overall_drift_score: number | null
  created_at: string
  docs_pr_number: number | null
}

// Extended drift event with full details and nested data
export interface DriftEventDetail {
  id: string
  pr_number: number
  base_branch: string
  head_branch: string
  processing_phase: ProcessingPhase
  drift_result: DriftResult
  overall_drift_score: number | null
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  docs_pr_number: number | null
  findings: DriftFinding[]
  code_changes: CodeChange[]
}

// Drift finding from API
export interface DriftFinding {
  id: string
  code_path: string
  doc_file_path: string | null
  change_type: ChangeType | null
  drift_type: DriftType | null
  drift_score: number | null
  explanation: string | null
  confidence: number | null
  created_at: string
}

// Code change from API
export interface CodeChange {
  id: string
  file_path: string
  change_type: ChangeType | null
  is_code: boolean | null
  is_ignored: boolean
}

// Helper to check if event is in progress
export function isEventInProgress(phase: ProcessingPhase): boolean {
  return !['completed', 'failed', 'fix_pr_raised', 'fix_pr_merged'].includes(phase)
}

// Helper to get phase display info
export function getPhaseInfo(phase: ProcessingPhase): { label: string; icon: string } {
  const phaseMap: Record<ProcessingPhase, { label: string; icon: string }> = {
    queued: { label: 'Queued', icon: '⏳' },
    scouting: { label: 'Scouting', icon: '🔍' },
    analyzing: { label: 'Analyzing', icon: '🤖' },
    generating: { label: 'Generating', icon: '✍️' },
    verifying: { label: 'Verifying', icon: '✅' },
    fix_pr_raised: { label: 'PR Raised', icon: '↗️' },
    fix_pr_merged: { label: 'PR Merged', icon: '🛣️' },
    completed: { label: 'Analysis Completed', icon: '✓' },
    failed: { label: 'Failed', icon: '✗' },
  }
  return phaseMap[phase]
}

// Helper to get result display info
export function getResultInfo(result: DriftResult): { label: string; color: string } {
  const resultMap: Record<DriftResult, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'gray' },
    clean: { label: 'Clean', color: 'green' },
    drift_detected: { label: 'Drift Detected', color: 'amber' },
    missing_docs: { label: 'Missing Docs', color: 'orange' },
    error: { label: 'Error', color: 'red' },
  }
  return resultMap[result]
}
