import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
    GitBranch,
    GitCommit,
    GitPullRequest,
    Star,
    GitFork,
    CaretRight,
    SignOut,
    Desktop,
    Plus
} from '@phosphor-icons/react'
import { Button } from '@/components/shadcn/button'
import { Skeleton } from '@/components/shadcn/skeleton'
import { useCurrentUser, getGravatarUrl } from '@/hooks/useUser'
import { useLogout } from '@/hooks/useAuth'
import { useDashboardStats, useDashboardRepos } from '@/hooks/useDashboard'
import type { Repository } from '@/types/repo'

function StatTile({
    icon: Icon,
    label,
    value,
    isLoading
}: {
    icon: React.ElementType
    label: string
    value: number
    isLoading?: boolean
}) {
    return (
        <div className="stat-tile">
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
            </div>
        </div>
    )
}

function RepositoryRow({ repo }: { repo: Repository }) {
    return (
        <div className="repo-row">
            <div className="repo-row-info">
                <img
                    src={repo.avatar_url || `https://www.gravatar.com/avatar/${repo.name}?d=robohash`}
                    className="repo-row-avatar"
                    alt=""
                />
                <div className="repo-row-text">
                    <Link to={`/repos/${repo.id}`} className="repo-row-name">
                        {repo.name}
                    </Link>
                    <p className="repo-row-description">{repo.description || 'No description'}</p>
                </div>
            </div>
            <div className="repo-row-meta">
                {repo.language && (
                    <span className="repo-language-badge">
                        {repo.language}
                    </span>
                )}
                <div className="repo-stat">
                    <Star className="size-4" />
                    <span>{repo.stargazers_count}</span>
                </div>
                <div className="repo-stat">
                    <GitFork className="size-4" />
                    <span>{repo.forks_count}</span>
                </div>
                <CaretRight className="size-4 opacity-50" />
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
    const { data: repos, isLoading: reposLoading, refetch: refetchRepos } = useDashboardRepos()
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
                        />
                        <StatTile
                            icon={GitBranch}
                            label="Repos Linked"
                            value={stats?.repos_linked_count ?? 0}
                            isLoading={statsLoading}
                        />
                        <StatTile
                            icon={GitCommit}
                            label="Drift Events"
                            value={stats?.drift_events_count ?? 0}
                            isLoading={statsLoading}
                        />
                        <StatTile
                            icon={GitPullRequest}
                            label="PRs Waiting"
                            value={stats?.pr_waiting_count ?? 0}
                            isLoading={statsLoading}
                        />
                    </div>

                    {/* Repositories Section */}
                    <div className="dashboard-repos-section">
                        <div className="dashboard-repos-header">
                            <h3>Recent Repositories</h3>
                            <div className="flex items-center gap-2">
                                <Link to="/repos">
                                    <Button variant="outline" className="border-glacial-salt/20 hover:bg-ocean-city/10">
                                        <GitBranch className="size-4 mr-2" />
                                        Manage Repos
                                    </Button>
                                </Link>
                                <a href="https://github.com/apps/delta-docs/installations/new">
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
                                displayedRepos.map((repo, index) => (
                                    <RepositoryRow key={repo.name + index} repo={repo} />
                                ))
                            ) : (
                                <div className="dashboard-repos-empty">
                                    <GitBranch className="size-12 opacity-30" />
                                    <p>No repositories linked yet</p>
                                    <p className="text-sm opacity-70">Connect your GitHub account to get started</p>
                                </div>
                            )}
                        </div>

                        {hasMoreRepos && (
                            <div className="dashboard-repos-more">
                                <Button
                                    variant="ghost"
                                    className="w-full"
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