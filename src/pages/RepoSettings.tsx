// RepoSettings.tsx - Repository Settings Management Page
// Allows users to configure individual repository settings and toggle monitoring

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, SignOut, FloppyDisk, GitPullRequest, CaretRight, CheckCircle, Clock, XCircle, GithubLogo, ArrowSquareOut, Gear } from '@phosphor-icons/react'
import { useRepos, useUpdateRepoSettings, useToggleRepo } from '@/hooks/useRepos'
import { useCurrentUser, getGravatarUrl } from '@/hooks/useUser'
import { useLogout } from '@/hooks/useAuth'
import { useDriftEvents } from '@/hooks/useDriftEvents'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Badge } from '@/components/shadcn/badge'
import { Skeleton } from '@/components/shadcn/skeleton'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { toast } from 'sonner'
import type { DriftResult } from '@/types/drift'

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

// Main RepoSettings Component
export default function RepoSettings() {
    // Get repository ID from URL parameters
    const { repoId } = useParams()
    const navigate = useNavigate()

    // API hooks for fetching repos and making updates
    const { data: repos, isLoading: isLoadingRepos } = useRepos()
    const { data: user, isLoading: userLoading } = useCurrentUser()
    const { mutate: logout, isPending: logoutPending } = useLogout()
    const updateSettings = useUpdateRepoSettings()
    const toggleRepo = useToggleRepo()
    const { data: driftEvents, isLoading: driftEventsLoading } = useDriftEvents(repoId!)

    // Find the specific repository from the list
    const repo = repos?.find(r => r.id === repoId)

    // Local state for form inputs
    const [docsPath, setDocsPath] = useState('')
    const [defaultBranch, setDefaultBranch] = useState('')
    const [reviewerGithubId, setReviewerGithubId] = useState('')
    const [docsPolicies, setDocsPolicies] = useState('')
    const [stylePreference, setStylePreference] = useState('professional')
    const [ignorePatterns, setIgnorePatterns] = useState('')

    // Load initial state when repo is found
    useEffect(() => {
        if (repo) {
            setDocsPath(repo.docs_root_path || '/docs')
            setDefaultBranch(repo.target_branch || 'main')
            setReviewerGithubId(repo.reviewer || '')
            setDocsPolicies(repo.docs_policies || '')
            setStylePreference(repo.style_preference || 'professional')
            setIgnorePatterns(repo.file_ignore_patterns?.join(', ') || '')
        }
    }, [repo])

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                window.location.href = '/login'
            }
        })
    }

    // Save Settings Handler
    const handleSave = () => {
        const patterns = ignorePatterns.trim()
            ? ignorePatterns.split(',').map(p => p.trim()).filter(Boolean)
            : null
        updateSettings.mutate({
            id: repo!.id,
            settings: {
                docs_root_path: docsPath,
                target_branch: defaultBranch,
                reviewer: reviewerGithubId || null,
                docs_policies: docsPolicies || null,
                style_preference: stylePreference,
                file_ignore_patterns: patterns
            }
        }, {
            onSuccess: () => {
                toast.success('Settings saved successfully!')
            },
            onError: (error) => {
                toast.error(`Failed to save settings: ${error.message}`)
            }
        })
    }

    // Toggle Active Handler
    const handleToggleActive = (isActive: boolean) => {
        toggleRepo.mutate({ id: repo!.id, is_active: isActive }, {
            onSuccess: () => {
                toast.success(isActive ? 'Repository monitoring enabled' : 'Repository monitoring disabled')
            },
            onError: (error) => {
                toast.error(`Failed to update status: ${error.message}`)
            }
        })
    }

    // Loading State
    if (isLoadingRepos || userLoading || !user) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ocean-city border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-4 text-glacial-salt">Loading...</p>
                </div>
            </div>
        )
    }

    // Error State - Repository not found
    if (!repo) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-glacial-salt mb-4">Repository not found</p>
                    <Button onClick={() => navigate('/repos')}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Repositories
                    </Button>
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
                        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} title="Back to dashboard">
                            <ArrowLeft className="size-5" />
                        </Button>
                        <Link to="/dashboard" className="dashboard-logo">
                            <div className="dashboard-logo-icon">
                                <img src="/logo.png" alt="Delta Logo" className="size-full object-contain p-1" />
                            </div>
                            <h1 className="dashboard-logo-text">Delta<span>.</span></h1>
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
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[
                            { label: 'Repositories', href: '/dashboard' },
                            { label: repo.repo_name }
                        ]}
                        className="mb-4"
                    />

                    {/* Page Header */}
                    <div className="dashboard-greeting mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 className="flex items-center gap-2">
                                    <Gear className="size-6 text-deep-navy" />
                                    {repo.repo_name}
                                </h2>
                                <Badge variant={repo.is_active ? "default" : "secondary"} className={repo.is_active ? "bg-green-500/15 text-green-600 hover:bg-green-500/25" : ""}>
                                    {repo.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <a
                                href={`https://github.com/${repo.repo_name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                            >
                                <GithubLogo className="size-4" weight="fill" />
                                View on GitHub
                                <ArrowSquareOut className="size-3" />
                            </a>
                        </div>
                        <p className="font-mono text-sm opacity-60">{repo.id}</p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Settings */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Activation Section */}
                            <div className="stat-tile">
                                <div className="flex items-center justify-between w-full">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="active-toggle" className="text-base font-medium text-white">Enable Monitoring</Label>
                                        <p className="text-sm text-white/70">
                                            {repo.is_active
                                                ? "Delta is actively monitoring this repository for drift."
                                                : "Monitoring is paused. No updates will be processed."}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {toggleRepo.isPending && <span className="text-xs text-white animate-pulse">Updating...</span>}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                id="active-toggle"
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={repo.is_active}
                                                onChange={(e) => handleToggleActive(e.target.checked)}
                                                disabled={toggleRepo.isPending}
                                            />
                                            <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Documentation Automation Section */}
                            <div className="stat-tile">
                                <div className="w-full space-y-4">
                                    <h3 className="text-white font-semibold border-b border-white/10 pb-2">Documentation Automation</h3>

                                    {/* Path and Branch Settings */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="docs-path" className="text-white text-sm">Documentation Path</Label>
                                            <Input
                                                id="docs-path"
                                                value={docsPath}
                                                onChange={(e) => setDocsPath(e.target.value)}
                                                placeholder="/docs"
                                                className="bg-deep-navy/50 border-white/20 text-white placeholder:text-white/40 h-8"
                                            />
                                            <p className="text-[11px] text-white/50">Where docs live in your repo.</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="default-branch" className="text-white text-sm">Target Branch</Label>
                                            <Input
                                                id="default-branch"
                                                value={defaultBranch}
                                                onChange={(e) => setDefaultBranch(e.target.value)}
                                                placeholder="main"
                                                className="bg-deep-navy/50 border-white/20 text-white placeholder:text-white/40 h-8"
                                            />
                                            <p className="text-[11px] text-white/50">Branch to target for PRs.</p>
                                        </div>
                                    </div>

                                    {/* Sensitivity and Style */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="reviewer-github-id" className="text-white text-sm">Reviewer GitHub ID</Label>
                                            <Input
                                                id="reviewer-github-id"
                                                value={reviewerGithubId}
                                                onChange={(e) => setReviewerGithubId(e.target.value)}
                                                placeholder="github_username"
                                                className="bg-deep-navy/50 border-white/20 text-white placeholder:text-white/40 h-8 font-mono"
                                            />
                                            <p className="text-[11px] text-white/50">GitHub user to assign as reviewer.</p>
                                        </div>



                                        <div className="space-y-1.5">
                                            <Label htmlFor="style-preference" className="text-white text-sm">Style Preference</Label>
                                            <select
                                                id="style-preference"
                                                className="flex h-8 w-full rounded-md border border-white/20 bg-deep-navy/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ocean-city"
                                                value={stylePreference}
                                                onChange={(e) => setStylePreference(e.target.value)}
                                            >
                                                <option className="bg-deep-navy" value="Concise">Concise</option>
                                                <option className="bg-deep-navy" value="Descriptive">Descriptive</option>
                                                <option className="bg-deep-navy" value="Professional">Professional</option>
                                                <option className="bg-deep-navy" value="Technical">Technical</option>
                                            </select>
                                            <p className="text-[11px] text-white/50">Tone for generated docs.</p>
                                        </div>
                                    </div>

                                    {/* Document Policies */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="docs-policies" className="text-white text-sm">Document Policies</Label>
                                        <textarea
                                            id="docs-policies"
                                            value={docsPolicies}
                                            onChange={(e) => setDocsPolicies(e.target.value)}
                                            placeholder="e.g. Always include a changelog...&#10;Use formal tone..."
                                            rows={2}
                                            className="flex w-full rounded-md border border-white/20 bg-deep-navy/50 px-3 py-2 text-sm text-white placeholder:text-white/40 font-mono resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ocean-city"
                                        />
                                        <p className="text-[11px] text-white/50">
                                            Custom instructions for documentation generation.
                                        </p>
                                    </div>

                                    {/* File Ignore Patterns */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ignore-patterns" className="text-white text-sm">File Ignore Patterns</Label>
                                        <Input
                                            id="ignore-patterns"
                                            value={ignorePatterns}
                                            onChange={(e) => setIgnorePatterns(e.target.value)}
                                            placeholder="node_modules/**, *.min.js"
                                            className="bg-deep-navy/50 border-white/20 text-white placeholder:text-white/40 h-8 font-mono"
                                        />
                                        <p className="text-[11px] text-white/50">
                                            Comma-separated. Supports glob patterns.
                                        </p>
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            onClick={handleSave}
                                            disabled={updateSettings.isPending}
                                            className="btn-primary-delta"
                                        >
                                            {updateSettings.isPending ? (
                                                <>Saving...</>
                                            ) : (
                                                <>
                                                    <FloppyDisk className="mr-2 size-4" />
                                                    Save Settings
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Recent Events */}
                        <div className="lg:col-span-1">
                            <div className="stat-tile p-0! overflow-hidden h-full flex flex-col w-full items-stretch!">
                                <div className="flex items-center justify-between p-4 border-b border-white/10 w-full">
                                    <h3 className="text-white font-semibold">Recent Events</h3>
                                    <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-white -mr-2">
                                        <Link to={`/repos/${repoId}/events`} className="hover:no-underline">
                                            View All
                                            <CaretRight className="size-4 ml-1" />
                                        </Link>
                                    </Button>
                                </div>
                                <div className="flex-1 w-full">
                                    {driftEventsLoading ? (
                                        <div className="p-4 space-y-3 w-full">
                                            <Skeleton className="h-10 w-full" />
                                            <Skeleton className="h-10 w-full" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ) : driftEvents && driftEvents.length > 0 ? (
                                        <div className="divide-y divide-white/10 w-full">
                                            {driftEvents.slice(0, 4).map((event) => (
                                                <Link
                                                    key={event.id}
                                                    to={`/repos/${repoId}/events/${event.id}`}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors hover:no-underline w-full"
                                                >
                                                    {getResultIcon(event.drift_result)}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-white text-sm">PR #{event.pr_number}</span>
                                                            <StatusBadge status={event.processing_phase} size="sm" />
                                                        </div>
                                                        <p className="text-xs text-white/50 truncate">
                                                            {event.head_branch} → {event.base_branch}
                                                        </p>
                                                    </div>
                                                    <CaretRight className="size-4 text-white/40" />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center flex-1 flex flex-col items-center justify-center w-full">
                                            <GitPullRequest className="size-8 mx-auto mb-2 text-white/30" />
                                            <p className="text-sm text-white/60">No drift events yet</p>
                                            <p className="text-xs text-white/40 mt-1">
                                                Events appear when PRs are analyzed
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
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
