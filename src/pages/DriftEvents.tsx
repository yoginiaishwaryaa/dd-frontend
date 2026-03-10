import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  GitPullRequest,
  ArrowLeft,
  SignOut,
  ArrowClockwise,
  GitBranch,
  GithubLogo,
  CaretRight,
  CheckCircle,
  XCircle,
  Clock,
  Gear,
} from '@phosphor-icons/react'
import { Button } from '@/components/shadcn/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Skeleton } from '@/components/shadcn/skeleton'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ScoreIndicator } from '@/components/shared/ScoreIndicator'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { useDriftEvents } from '@/hooks/useDriftEvents'
import { useRepos } from '@/hooks/useRepos'
import { useCurrentUser, getGravatarUrl } from '@/hooks/useUser'
import { useLogout } from '@/hooks/useAuth'
import { NotificationBell } from '@/components/shared/NotificationBell'
import type { DriftEvent, DriftResult } from '@/types/drift'
import { isEventInProgress } from '@/types/drift'

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

function getResultIcon(result: DriftResult) {
  switch (result) {
    case 'clean':
      return <CheckCircle className="size-5 text-green-500" weight="fill" />
    case 'drift_detected':
    case 'missing_docs':
      return <Clock className="size-5 text-amber-500" weight="fill" />
    case 'error':
      return <XCircle className="size-5 text-red-500" weight="fill" />
    default:
      return <Clock className="size-5 text-gray-400" weight="duotone" />
  }
}

function DriftEventRow({ event, repoName }: { event: DriftEvent; repoName: string }) {
  const navigate = useNavigate()
  const isInProgress = isEventInProgress(event.processing_phase)

  return (
    <div
      className="repo-row cursor-pointer"
      onClick={() => navigate(`${event.id}`)}
    >
      <div className="repo-row-info">
        {/* PR info */}
        <div className="repo-row-text">
          {/* First Line: PR Number and Badges */}
          <div className="flex items-center gap-2">
            <span className="repo-row-name">PR #{event.pr_number}</span>
            <StatusBadge status={event.processing_phase} size="sm" />
            {event.drift_result !== 'pending' && !isInProgress && (
              <StatusBadge status={event.drift_result} size="sm" />
            )}
          </div>

          {/* Second Line: Icon, Branches, Date */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-shrink-0 scale-75 origin-left">{getResultIcon(event.drift_result)}</div>
            <p className="repo-row-description !mt-0 flex items-center">
              <GitBranch className="inline size-3 mr-1" />
              {event.head_branch} → {event.base_branch}
              <span className="mx-2">•</span>
              {formatTimeAgo(event.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="repo-row-meta">
        {/* Score */}
        {event.overall_drift_score !== null && (
          <ScoreIndicator score={event.overall_drift_score} size="sm" showLabel={false} />
        )}

        {/* Docs PR badge */}
        {event.docs_pr_number && (
          <a
            href={`https://github.com/${repoName}/pull/${event.docs_pr_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-deep-blue/20 text-white px-2 py-1 rounded-full hover:bg-deep-blue/30"
            onClick={(e) => e.stopPropagation()}
            title="View generated docs PR"
            style={{ color: 'white' }}
          >
            Fix PR #{event.docs_pr_number}
          </a>
        )}

        {/* GitHub link */}
        <a
          href={`https://github.com/${repoName}/pull/${event.pr_number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-ocean-city transition-colors"
          onClick={(e) => e.stopPropagation()}
          title="View PR on GitHub"
          style={{ color: 'white' }}
        >
          <GithubLogo className="size-5" weight="fill" />
        </a>

        <CaretRight className="size-4 opacity-50" />
      </div>
    </div>
  )
}

function DriftEventRowSkeleton() {
  return (
    <div className="repo-row">
      <div className="repo-row-info">
        <Skeleton className="size-5 rounded-full" />
        <div className="repo-row-text">
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-3 w-60" />
        </div>
      </div>
      <div className="repo-row-meta">
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

type FilterType = 'all' | 'in-progress' | 'completed' | 'failed'

export default function DriftEvents() {
  const { repoId } = useParams<{ repoId: string }>()
  const [filter, setFilter] = useState<FilterType>('all')

  const { data: repos } = useRepos()
  const repo = repos?.find((r) => r.id === repoId)
  const { data: events, isLoading, error, refetch } = useDriftEvents(repoId!)
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { mutate: logout, isPending: logoutPending } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = '/login'
      },
    })
  }

  // Filter events
  const filteredEvents = events?.filter((e) => {
    switch (filter) {
      case 'in-progress':
        return isEventInProgress(e.processing_phase)
      case 'completed':
        return e.processing_phase === 'completed'
      case 'failed':
        return e.processing_phase === 'failed'
      default:
        return true
    }
  })

  // Stats
  const stats = {
    total: events?.length ?? 0,
    clean: events?.filter((e) => e.drift_result === 'clean').length ?? 0,
    drift: events?.filter((e) => ['drift_detected', 'missing_docs'].includes(e.drift_result)).length ?? 0,
    failed: events?.filter((e) => e.processing_phase === 'failed').length ?? 0,
  }

  // Loading state
  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ocean-city border-r-transparent" />
          <p className="mt-4 text-glacial-salt">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="dashboard-decorations">
          <div className="geo-triangle t1" />
          <div className="geo-triangle t2" />
          <div className="geo-triangle t3" />
          <div className="geo-triangle t4" />
          <div className="geo-triangle t5" />
          <div className="geo-triangle t6" />
          <div className="geo-triangle t7" />
          <div className="geo-triangle t8" />
          <div className="geo-dot d1" />
          <div className="geo-dot d2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild title="Back to Settings">
              <Link to={`/repos/${repoId}`}>
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
              { label: repo?.repo_name || 'Repository', href: `/repos/${repoId}` },
              { label: 'Events' }
            ]}
            className="mb-4"
          />

          {/* Page Header */}
          <div className="dashboard-greeting">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitPullRequest className="size-6 text-deep-navy" />
                <h2>Drift Events</h2>
              </div>
              <Button variant="outline" size="sm" asChild className="border-deep-navy/30 text-deep-navy hover:bg-deep-navy/10">
                <Link to={`/repos/${repoId}`}>
                  <Gear className="size-4 mr-1" />
                  Settings
                </Link>
              </Button>
            </div>
            <p>Drift analysis history for {repo?.repo_name}</p>
          </div>

          {/* Stats Row */}
          <div className="dashboard-stats mb-6">
            <div className="stat-tile">
              <div className="stat-tile-content">
                <span className="stat-tile-value">{stats.total}</span>
                <span className="stat-tile-label">Total Events</span>
              </div>
            </div>
            <div className="stat-tile" style={{ background: 'var(--color-success)' }}>
              <div className="stat-tile-content">
                <span className="stat-tile-value">{stats.clean}</span>
                <span className="stat-tile-label">Clean</span>
              </div>
            </div>
            <div className="stat-tile" style={{ background: '#d97706' }}>
              <div className="stat-tile-content">
                <span className="stat-tile-value">{stats.drift}</span>
                <span className="stat-tile-label">Drift Found</span>
              </div>
            </div>
            <div className="stat-tile" style={{ background: 'var(--color-error)' }}>
              <div className="stat-tile-content">
                <span className="stat-tile-value">{stats.failed}</span>
                <span className="stat-tile-label">Failed</span>
              </div>
            </div>
          </div>

          {/* Filter & Actions */}
          <div className="flex items-center justify-between mb-4">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Analysis Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="hover:bg-white/10 text-white disabled:opacity-50"
              title="Refresh"
            >
              <ArrowClockwise className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
              {!isLoading && <span className="ml-1.5 text-xs">Refresh</span>}
            </Button>
          </div>

          {/* Events List */}
          <div className="dashboard-repos-list">
            {isLoading ? (
              <>
                <DriftEventRowSkeleton />
                <DriftEventRowSkeleton />
                <DriftEventRowSkeleton />
              </>
            ) : error ? (
              <div className="dashboard-repos-empty">
                <GitPullRequest className="size-12 opacity-30" />
                <p className="text-red-400">Error loading drift events</p>
                <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : filteredEvents?.length === 0 ? (
              <div className="dashboard-repos-empty">
                <GitPullRequest className="size-12 opacity-30" />
                <p>
                  {filter === 'all'
                    ? 'No drift events yet'
                    : `No ${filter.replace('-', ' ')} events`}
                </p>
                <p className="text-sm opacity-70">
                  Events appear when PRs are analyzed in this repository
                </p>
              </div>
            ) : (
              filteredEvents?.map((event) => (
                <DriftEventRow key={event.id} event={event} repoName={repo?.repo_name || ''} />
              ))
            )}
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
