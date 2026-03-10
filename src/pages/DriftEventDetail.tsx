import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  SignOut,
  GitBranch,
  GithubLogo,
  Clock,
  CheckCircle,
  XCircle,
  Warning,
  FileCode,
  FileDoc,
  CaretDown,
  ArrowSquareOut,
} from '@phosphor-icons/react'
import { Button } from '@/components/shadcn/button'
import { Skeleton } from '@/components/shadcn/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn/accordion'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn/collapsible'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ScoreIndicator } from '@/components/shared/ScoreIndicator'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { useDriftEventDetail } from '@/hooks/useDriftEvents'
import { useRepos } from '@/hooks/useRepos'
import { useCurrentUser, getGravatarUrl } from '@/hooks/useUser'
import { useLogout } from '@/hooks/useAuth'
import { isEventInProgress, type ProcessingPhase, type DriftFinding, type CodeChange } from '@/types/drift'
import { useState } from 'react'

const WORKFLOW_PHASES_FULL: ProcessingPhase[] = [
  'queued',
  'scouting',
  'analyzing',
  'generating',
  'verifying',
  'fix_pr_raised',
  'fix_pr_merged',
]

const WORKFLOW_PHASES_CLEAN: ProcessingPhase[] = [
  'queued',
  'scouting',
  'analyzing',
  'completed'
]

const PHASE_LABELS: Record<string, string> = {
  queued: 'Queue',
  scouting: 'Scout',
  analyzing: 'Analyze',
  generating: 'Generate',
  verifying: 'Verify',
  fix_pr_raised: 'PR Raised',
  fix_pr_merged: 'PR Merged',
  completed: 'Completed'
}

function WorkflowProgress({ currentPhase, driftResult }: { currentPhase: ProcessingPhase, driftResult?: string }) {
  const isClean = driftResult === 'clean'
  const phases = isClean ? WORKFLOW_PHASES_CLEAN : WORKFLOW_PHASES_FULL
  let currentIndex = phases.indexOf(currentPhase)

  if (currentPhase === 'completed') {
    currentIndex = isClean ? 3 : 7
  }

  const isFailed = currentPhase === 'failed'

  return (
    <div className="flex items-center gap-1 w-full flex-wrap sm:flex-nowrap">
      {phases.map((phase, i) => {
        let isCompleted = false
        let isCurrent = false

        if (currentPhase === 'completed') {
          isCompleted = i <= currentIndex
          isCurrent = false
        } else {
          isCompleted = i < currentIndex || currentPhase === 'fix_pr_merged'
          isCurrent = phase === currentPhase
        }

        return (
          <div key={phase} className={`flex items-center ${i < phases.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all shrink-0
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent && !isFailed ? 'bg-blue-500 text-white animate-pulse' : ''}
                  ${isCurrent && isFailed ? 'bg-red-500 text-white' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] font-medium ${isCompleted || isCurrent ? 'text-white/90' : 'text-white/40'} whitespace-nowrap`}>
                {PHASE_LABELS[phase]}
              </span>
            </div>
            {i < phases.length - 1 && (
              <div
                className={`flex-1 min-w-[12px] h-1 mx-1 sm:mx-2 rounded self-start mt-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function FindingCard({ finding }: { finding: DriftFinding }) {
  const changeTypeColors = {
    added: 'text-green-600 bg-green-100',
    modified: 'text-amber-600 bg-amber-100',
    deleted: 'text-red-600 bg-red-100',
  }

  const driftTypeIcons = {
    outdated_docs: <Clock className="size-4" />,
    missing_docs: <Warning className="size-4" />,
    ambiguous_docs: <Warning className="size-4" />,
  }

  return (
    <AccordionItem value={finding.id} className="border-white/10 w-full">
      <AccordionTrigger className="hover:no-underline py-4 px-4 hover:bg-white/5 transition-colors w-full">
        <div className="flex items-center gap-4 flex-1 min-w-0 text-left">
          <FileCode className="size-5 text-blue-400 shrink-0" />
          <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-4 flex-wrap">
              <code className="text-sm font-mono text-white">{finding.code_path}</code>
              {finding.change_type && (
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${changeTypeColors[finding.change_type] || 'bg-gray-100'
                    }`}
                >
                  {finding.change_type}
                </span>
              )}
              {finding.drift_type && (
                <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 flex items-center gap-1 font-medium">
                  {driftTypeIcons[finding.drift_type]}
                  {finding.drift_type.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
          {finding.drift_score !== null && (
            <div className="shrink-0 mr-4">
              <ScoreIndicator score={finding.drift_score} size="sm" showLabel={false} />
            </div>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 pb-4 px-4">
        <div className="pl-9 space-y-3">
          {finding.explanation && (
            <p className="text-sm text-white/80 leading-relaxed">{finding.explanation}</p>
          )}
          {finding.doc_file_path && (
            <p className="text-xs text-white/60">
              <FileDoc className="inline size-3 mr-1" />
              Related doc: <code className="text-blue-300">{finding.doc_file_path}</code>
            </p>
          )}
          {finding.confidence !== null && (
            <p className="text-xs text-white/50 font-medium">
              Confidence: {(finding.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function CodeChangesList({ changes }: { changes: CodeChange[] }) {
  const [isOpen, setIsOpen] = useState(false)

  const codeFiles = changes.filter((c) => c.is_code && !c.is_ignored)
  const docFiles = changes.filter((c) => !c.is_code && !c.is_ignored)
  const ignoredFiles = changes.filter((c) => c.is_ignored)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <FileCode className="size-4 text-ocean-city" />
          <span className="font-medium text-sm text-white">Show {changes.length} file{changes.length !== 1 ? 's' : ''}</span>
        </div>
        <CaretDown className={`size-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 space-y-3">
        {codeFiles.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Code ({codeFiles.length})</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="space-y-1.5">
              {codeFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 text-xs pl-1">
                  <span className={`font-bold shrink-0 ${file.change_type === 'added' ? 'text-green-400' :
                    file.change_type === 'deleted' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                    {file.change_type === 'added' ? '+' : file.change_type === 'deleted' ? '-' : '~'}
                  </span>
                  <span className="font-mono text-white/80 break-all">{file.file_path}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {docFiles.length > 0 && (
          <div className={codeFiles.length > 0 ? '' : 'pt-2'}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Docs ({docFiles.length})</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="space-y-1.5">
              {docFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 text-xs pl-1">
                  <span className={`font-bold shrink-0 ${file.change_type === 'added' ? 'text-green-400' :
                    file.change_type === 'deleted' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                    {file.change_type === 'added' ? '+' : file.change_type === 'deleted' ? '-' : '~'}
                  </span>
                  <span className="font-mono text-cyan-300 break-all">{file.file_path}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {ignoredFiles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Ignored ({ignoredFiles.length})</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="space-y-1.5">
              {ignoredFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 text-xs pl-1 opacity-50">
                  <span className="font-bold shrink-0 text-white/30">○</span>
                  <span className="font-mono text-white/40 break-all">{file.file_path}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function DriftEventDetail() {
  const { repoId, eventId } = useParams<{ repoId: string; eventId: string }>()
  const navigate = useNavigate()

  const { data: repos } = useRepos()
  const repo = repos?.find((r) => r.id === repoId)
  const { data: event, isLoading: eventLoading } = useDriftEventDetail(repoId!, eventId!)
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { mutate: logout, isPending: logoutPending } = useLogout()

  // Extract findings and code changes from nested event data
  const findings = event?.findings
  const codeChanges = event?.code_changes

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = '/login'
      },
    })
  }

  const isLoading = eventLoading || userLoading

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ocean-city border-r-transparent" />
          <p className="mt-4 text-glacial-salt">Loading...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-glacial-salt mb-4">Drift event not found</p>
          <Button onClick={() => navigate(`/repos/${repoId}/events`)}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  const repoName = repo?.repo_name || ''
  const isInProgress = isEventInProgress(event.processing_phase)

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="dashboard-decorations">
          <div className="geo-triangle t1" />
          <div className="geo-triangle t2" />
          <div className="geo-triangle t3" />
          <div className="geo-triangle t4" />
          <div className="geo-dot d1" />
          <div className="geo-dot d2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild title="Back to Events">
              <Link to={`/repos/${repoId}/events`}>
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <Link to="/dashboard" className="dashboard-logo">
              <div className="dashboard-logo-icon">
                <img src="/logo.png" alt="Delta Logo" className="size-full object-contain p-1" />
              </div>
              <h1 className="dashboard-logo-text">
                Delta<span>.</span>
              </h1>
            </Link>
          </div>
          <div className="dashboard-user">
            <NotificationBell />
            <img
              src={getGravatarUrl(user.email)}
              alt="User avatar"
              className="dashboard-user-avatar"
            />
            <div className="dashboard-user-info">
              <p className="dashboard-user-name">{user.full_name || 'User'}</p>
              <p className="dashboard-user-email">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutPending}
              className="dashboard-logout-btn"
              title="Sign out"
            >
              <SignOut className="size-5" />
            </button>
          </div>
        </header>

        {/* Main Card */}
        <main className="dashboard-card">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Repositories', href: '/dashboard' },
              { label: repoName || 'Repository', href: `/repos/${repoId}` },
              { label: 'Events', href: `/repos/${repoId}/events` },
              { label: `PR #${event.pr_number}` }
            ]}
            className="mb-4"
          />

          {/* Page Header */}
          <div className="dashboard-greeting">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2>PR #{event.pr_number}</h2>
                <StatusBadge status={event.processing_phase} />
                {!isInProgress && <StatusBadge status={event.drift_result} />}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://github.com/${repoName}/pull/${event.pr_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-delta text-sm"
                >
                  <GithubLogo className="size-4 mr-1" weight="fill" />
                  View PR
                  <ArrowSquareOut className="size-3 ml-1" />
                </a>
                {event.docs_pr_number && (
                  <a
                    href={`https://github.com/${repoName}/pull/${event.docs_pr_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-delta"
                  >
                    <FileDoc className="size-4" />
                    Docs PR #{event.docs_pr_number}
                    <ArrowSquareOut className="size-3" />
                  </a>
                )}
              </div>
            </div>
            <p className="flex items-center gap-2 mt-1 text-deep-navy/70">
              <GitBranch className="size-4" />
              {event.head_branch} → {event.base_branch}
            </p>
          </div>

          {/* Error Message */}
          {event.error_message && (
            <section className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-600">Error</h4>
                  <p className="text-sm text-red-500 mt-1">{event.error_message}</p>
                </div>
              </div>
            </section>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workflow Progress */}
              <section className="stat-tile">
                <div className="w-full space-y-4">
                  <h3 className="font-semibold text-lg">Analysis Progress</h3>
                  <WorkflowProgress currentPhase={event.processing_phase} driftResult={event.drift_result} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">
                      {event.started_at
                        ? `Started: ${new Date(event.started_at).toLocaleString()}`
                        : 'Not started'}
                    </span>
                    {event.completed_at && (
                      <span className="opacity-70">
                        Completed: {new Date(event.completed_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {event.overall_drift_score !== null && (
                    <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                      <span className="font-medium">Overall Drift Score:</span>
                      <ScoreIndicator score={event.overall_drift_score} size="lg" />
                    </div>
                  )}
                </div>
              </section>

              {/* Findings */}
              <section>
                <h3 className="font-semibold text-lg mb-3 text-deep-navy">
                  Drift Findings {findings && `(${findings.length})`}
                </h3>
                {eventLoading ? (
                  <div className="stat-tile">
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : findings && findings.length > 0 ? (
                  <Accordion type="multiple" className="stat-tile p-0! overflow-hidden w-full flex-col block">
                    {findings.map((finding) => (
                      <FindingCard key={finding.id} finding={finding} />
                    ))}
                  </Accordion>
                ) : (
                  <div className="stat-tile text-center py-8">
                    <CheckCircle className="size-12 mx-auto mb-2 text-green-400 opacity-50" />
                    <p className="text-green-300">No drift detected</p>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Code Changes */}
              {codeChanges && codeChanges.length > 0 && (
                <section className="bg-deep-blue rounded-xl overflow-hidden shadow-lg">
                  <div className="px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-base text-white">Files Changed</h3>
                  </div>
                  <CodeChangesList changes={codeChanges} />
                </section>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>
            By using Delta, you agree to our <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>
          </p>
        </footer>
      </div>
    </div>
  )
}
