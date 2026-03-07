// RepoList.tsx - Repository List Page
// Displays all GitHub repositories linked to the user's account
// Allows navigation to individual repository settings

import { Link } from 'react-router-dom'
import { GitBranch, ArrowClockwise, SignOut, Gear, ArrowLeft, GithubLogo } from '@phosphor-icons/react'
import { useRepos, type Repository } from '@/hooks/useRepos'
import { useLogout } from '@/hooks/useAuth'
import { useCurrentUser, getGravatarUrl } from '@/hooks/useUser'
import { Button } from '@/components/shadcn/button'
import { Skeleton } from '@/components/shadcn/skeleton'

// RepoCard Component - Displays individual repository information in a card
const RepoCard = ({ repo }: { repo: Repository }) => {
    return (
        <div className="repo-row">
            <div className="repo-row-info">
                <img
                    src={repo.avatar_url || `https://www.gravatar.com/avatar/${repo.repo_name}?d=robohash`}
                    className="repo-row-avatar"
                    alt=""
                />
                <div className="repo-row-text">
                    <Link to={`/repos/${repo.id}`} className="repo-row-name">
                        {repo.repo_name}
                    </Link>
                    <p className="repo-row-description">
                        {repo.is_active ? '✓ Monitoring active' : '○ Monitoring paused'}
                    </p>
                </div>
            </div>
            <div className="repo-row-meta">
                <a
                    href={`https://github.com/${repo.repo_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-deep-navy hover:text-deep-blue font-semibold transition-colors mr-3 flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-md hover:bg-white/60"
                >
                    <GithubLogo className="size-4" weight="fill" />
                    View on GitHub
                </a>
                <Button variant="ghost" size="sm" asChild className="text-deep-navy hover:text-deep-blue bg-white/40 hover:bg-white/60 font-semibold">
                    <Link to={`/repos/${repo.id}`} className="flex items-center">
                        <Gear className="size-4 mr-2" />
                        Settings
                    </Link>
                </Button>
            </div>
        </div>
    )
}

function RepoCardSkeleton() {
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
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
    )
}

// Main RepoList Component
export default function RepoList() {
    // Fetch repositories from API using React Query
    const { data: repos, isLoading, error, refetch } = useRepos()
    const { data: user, isLoading: userLoading } = useCurrentUser()
    const { mutate: logout, isPending: logoutPending } = useLogout()

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                window.location.href = '/login'
            }
        })
    }

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
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild title="Back to Dashboard">
                            <Link to="/dashboard">
                                <ArrowLeft className="size-5" />
                            </Link>
                        </Button>
                        <Link to="/dashboard" className="dashboard-logo">
                            <div className="dashboard-logo-icon">
                                <img src="/logo.png" alt="Delta Logo" className="size-full object-contain p-1" />
                            </div>
                            <h1 className="dashboard-logo-text">Delta<span>.</span></h1>
                        </Link>
                    </div>
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
                    {/* Page Header */}
                    <div className="dashboard-greeting">
                        <h2>Manage Repositories</h2>
                        <p>Configure monitoring settings for your linked repositories</p>
                    </div>

                    {/* Repositories Section */}
                    <div className="dashboard-repos-section">
                        <div className="dashboard-repos-header">
                            <h3>All Repositories</h3>
                            <Button variant="ghost" size="sm" onClick={() => refetch()} title="Refresh">
                                <ArrowClockwise className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        <div className="dashboard-repos-list">
                            {isLoading ? (
                                <>
                                    <RepoCardSkeleton />
                                    <RepoCardSkeleton />
                                    <RepoCardSkeleton />
                                </>
                            ) : error ? (
                                <div className="dashboard-repos-empty">
                                    <GitBranch className="size-12 opacity-30" />
                                    <p className="text-red-400">Error loading repositories</p>
                                    <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                                        Retry
                                    </Button>
                                </div>
                            ) : repos?.length === 0 ? (
                                <div className="dashboard-repos-empty">
                                    <GitBranch className="size-12 opacity-30" />
                                    <p>No repositories linked yet</p>
                                    <p className="text-sm opacity-70">Connect your GitHub account to get started</p>
                                </div>
                            ) : (
                                repos?.map((repo) => (
                                    <RepoCard key={repo.id} repo={repo} />
                                ))
                            )}
                        </div>
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
