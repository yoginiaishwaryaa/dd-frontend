import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
    GitBranch,
    GitCommit,
    GitPullRequest,
    CaretRight,
    SignOut,
    Desktop,
    Plus,
    Gear
} from '@phosphor-icons/react'
import { Button } from '@/components/shadcn/button'
import { Skeleton } from '@/components/shadcn/skeleton'
import { useCurrentUser, getGravatarUrl } from '@/hooks/useUser'
import { useLogout } from '@/hooks/useAuth'
import { useDashboardStats } from '@/hooks/useDashboard'
import { useRepos } from '@/hooks/useRepos'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Repository } from '@/hooks/useRepos'

function StatTile({
    icon: Icon,
    label,
    value,
    isLoading,
    href,
    onClick,
    hint
}: {
    icon: React.ElementType
    label: string
    value: number
    isLoading?: boolean
    href?: string
    onClick?: () => void
    hint?: string
}) {
    const content = (
        <div className={`stat-tile ${href || onClick ? 'cursor-pointer hover:scale-[1.02] hover:bg-deep-blue/80 transition-all' : ''}`}>
            <div className="stat-tile-icon">
                <Icon className="size-5" weight="duotone" />
            </div>
            <div className="stat-tile-content">
                {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                ) : (
                    <span className="stat-tile-value">{value}</span>
                )}
                <span className="stat-tile-label">{label}</span>
                {hint && <span className="text-[10px] text-white/40 mt-0.5">{hint}</span>}
            </div>
            {(href || onClick) && (
                <CaretRight className="size-4 text-white/30 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
        </div>
    )

    if (href) {
        return <Link to={href} className="block">{content}</Link>
    }
    if (onClick) {
        return <button onClick={onClick} className="text-left w-full">{content}</button>
    }
    return content
}

function RepositoryRow({ repo }: { repo: Repository }) {
    return (
        <div className="repo-row group">
            <div className="repo-row-info">
                <img
                    src={repo.avatar_url || `https://www.gravatar.com/avatar/${repo.repo_name}?d=robohash`}
                    className="repo-row-avatar"
                    alt=""
                />
                <div className="repo-row-text">
                    <Link to={`/repos/${repo.id}/events`} className="repo-row-name">
                        {repo.repo_name}
                    </Link>
                    <p className="repo-row-description">
                        {repo.is_active ? 'Monitoring active' : 'Monitoring paused'}
                        {repo.target_branch && ` • ${repo.target_branch}`}
                    </p>
                </div>
            </div>
            <div className="repo-row-meta">
                {repo.is_active ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Active</span>
                ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">Inactive</span>
                )}
                
                {/* Quick Actions - visible on hover */}
                <div className="flex items-center gap-1 transition-opacity">
                    <Link
                        to={`/repos/${repo.id}/events`}
                        className="p-2 rounded hover:bg-white/10 transition-colors"
                        style={{ color: 'white' }}
                        title="View drift events"
                    >
                        <GitCommit className="size-6" style={{ color: 'white' }} />
                    </Link>
                    <Link
                        to={`/repos/${repo.id}`}
                        className="p-2 rounded hover:bg-white/10 transition-colors"
                        style={{ color: 'white' }}
                        title="Repository settings"
                    >
                        <Gear className="size-6" style={{ color: 'white' }} />
                    </Link>
                </div>
                
                <Link to={`/repos/${repo.id}/events`} className="cursor-pointer" title="View drift events">
                    <CaretRight className="size-4 opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'white' }} />
                </Link>
            </div>
        </div>
    )
}

function RepositoryRowSkeleton() {
    return (
        <div className="repo-row">
            <div className="repo-row-info">
                <Skeleton className="size-10 rounded-full" />
                <div className="repo-row-text">
                    <Skeleton className="h-5 w-48 mb-1" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <div className="repo-row-meta">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
            </div>
        </div>
    )
}

export default function Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: user, isLoading: userLoading } = useCurrentUser()
    const { mutate: logout, isPending: logoutPending } = useLogout()
    const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats()
    const { data: repos, isLoading: reposLoading, refetch: refetchRepos } = useRepos()
    const [showAllRepos, setShowAllRepos] = useState(false)

    // Check for status parameter (from GitHub callback)
    useEffect(() => {
        const status = searchParams.get('status')
        if (status === 'installed' || status === 'linked') {
            // Refetch data after GitHub installation
            refetchStats()
            refetchRepos()
            // Remove the status parameter from URL
            setSearchParams({})
        }
    }, [searchParams, setSearchParams, refetchStats, refetchRepos])

    const reposList = repos || []
    const displayedRepos = showAllRepos ? reposList : reposList.slice(0, 5)
    const hasMoreRepos = reposList.length > 5

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                window.location.href = '/login'
            }
        })
    }

    // Show loading while fetching user data
    if (userLoading || !user) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ocean-city border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
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
                    <div className="geo-triangle t9" />
                    <div className="geo-triangle t10" />
                    <div className="geo-triangle t11" />
                    <div className="geo-triangle t12" />
                    <div className="geo-triangle t13" />
                    <div className="geo-triangle t14" />
                    <div className="geo-triangle t15" />
                    <div className="geo-triangle t16" />
                    <div className="geo-triangle t17" />
                    <div className="geo-triangle t18" />
                    <div className="geo-triangle t19" />
                    <div className="geo-triangle t20" />
                    <div className="geo-triangle t21" />
                    <div className="geo-triangle t22" />
                    <div className="geo-triangle t23" />
                    <div className="geo-triangle t24" />
                    <div className="geo-triangle t25" />
                    <div className="geo-dot d1" />
                    <div className="geo-dot d2" />
                    <div className="geo-dot d3" />
                    <div className="geo-dot d4" />
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-container">
                {/* Header */}
                <header className="dashboard-header">
                    <Link to="/dashboard" className="dashboard-logo">
                        <div className="dashboard-logo-icon">
                            <img src="/logo.png" alt="Delta Logo" className="size-full object-contain p-1" />
                        </div>
                        <h1 className="dashboard-logo-text">Delta<span>.</span></h1>
                    </Link>
                    <div className="dashboard-user">
                        <NotificationBell />
                        <img
                            src={getGravatarUrl(user.email)}
                            alt="User avatar"
                            className="dashboard-user-avatar"
                        />
                        <div className="dashboard-user-info">
                            <p className="dashboard-user-name">
                                {user.full_name || 'User'}
                            </p>
                            <p className="dashboard-user-email">
                                {user.email}
                            </p>
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
                    {/* Greeting */}
                    <div className="dashboard-greeting">
                        <h2>Welcome back, {user.full_name?.split(' ')[0] || 'there'}</h2>
                        <p>Here's an overview of your linked repositories</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="dashboard-stats">
                        <StatTile
                            icon={Desktop}
                            label="Installations"
                            value={stats?.installations_count ?? 0}
                            isLoading={statsLoading}
                            hint="GitHub App"
                        />
                        <StatTile
                            icon={GitBranch}
                            label="Repos Linked"
                            value={stats?.repos_linked_count ?? 0}
                            isLoading={statsLoading}
                            hint="Click to manage"
                            href="/repos"
                        />
                        <StatTile
                            icon={GitCommit}
                            label="Drift Events"
                            value={stats?.drift_events_count ?? 0}
                            isLoading={statsLoading}
                            hint="All analyses"
                        />
                        <StatTile
                            icon={GitPullRequest}
                            label="PRs Waiting"
                            value={stats?.pr_waiting_count ?? 0}
                            isLoading={statsLoading}
                            hint="Need review"
                        />
                    </div>

                    {/* Repositories Section */}
                    <div className="dashboard-repos-section" id="repos-section">
                        <div className="dashboard-repos-header">
                            <h3>Recent Repositories</h3>
                            <div className="flex items-center gap-2">
                                <Link to="/repos">
                                    <Button variant="outline" className="border-deep-navy/30 text-deep-navy hover:bg-deep-navy/10">
                                        <GitBranch className="size-4 mr-2" />
                                        Manage Repos
                                    </Button>
                                </Link>
                                <a href="https://github.com/apps/testdelta/installations/new">
                                    <Button className="btn-primary-delta">
                                        <Plus className="size-4 mr-2" />
                                        Link Repository
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="dashboard-repos-list">
                            {reposLoading ? (
                                <>
                                    <RepositoryRowSkeleton />
                                    <RepositoryRowSkeleton />
                                    <RepositoryRowSkeleton />
                                </>
                            ) : displayedRepos.length > 0 ? (
                                displayedRepos.map((repo) => (
                                    <RepositoryRow key={repo.id} repo={repo} />
                                ))
                            ) : (
                                <EmptyState
                                    icon={GitBranch}
                                    title="No repositories linked"
                                    description="Connect your GitHub repositories to start monitoring documentation drift"
                                    action={{
                                        label: "Link Repository",
                                        href: "https://github.com/apps/delta-docs/installations/new",
                                        external: true
                                    }}
                                />
                            )}
                        </div>

                        {hasMoreRepos && (
                            <div className="dashboard-repos-more">
                                <Button
                                    variant="ghost"
                                    className="w-full text-deep-navy/70 hover:text-deep-navy hover:bg-deep-navy/10"
                                    onClick={() => setShowAllRepos(!showAllRepos)}
                                >
                                    {showAllRepos ? 'Show Less' : `Show More (${reposList.length - 5} more)`}
                                </Button>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <p>By using Delta, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
                </footer>
            </div>
        </div>
    )
}
