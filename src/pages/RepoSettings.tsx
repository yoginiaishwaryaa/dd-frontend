// RepoSettings.tsx - Repository Settings Management Page
// Allows users to configure individual repository settings and toggle monitoring

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, SignOut, FloppyDisk, GitBranch } from '@phosphor-icons/react'
import { useRepos, useUpdateRepoSettings, useToggleRepo } from '@/hooks/useRepos'
import { useCurrentUser, getGravatarUrl } from '@/hooks/useUser'
import { useLogout } from '@/hooks/useAuth'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Badge } from '@/components/shadcn/badge'
import { Separator } from '@/components/shadcn/separator'
import { Skeleton } from '@/components/shadcn/skeleton'
import { toast } from 'sonner'

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

    // Find the specific repository from the list
    const repo = repos?.find(r => r.id === repoId)

    // Local state for form inputs
    const [docsPath, setDocsPath] = useState('')
    const [defaultBranch, setDefaultBranch] = useState('')
    const [driftSensitivity, setDriftSensitivity] = useState(0.5)
    const [stylePreference, setStylePreference] = useState('professional')

    // Load initial state when repo is found
    useEffect(() => {
        if (repo) {
            setDocsPath(repo.docs_root_path || '/docs')
            setDefaultBranch(repo.target_branch || 'main')
            setDriftSensitivity(repo.drift_sensitivity || 0.5)
            setStylePreference(repo.style_preference || 'professional')
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
        updateSettings.mutate({
            id: repo!.id,
            settings: {
                docs_root_path: docsPath,
                target_branch: defaultBranch,
                drift_sensitivity: Number(driftSensitivity),
                style_preference: stylePreference
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
                        <Button variant="ghost" size="icon" onClick={() => navigate('/repos')} title="Back to repos">
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
                <main className="dashboard-card max-w-4xl">
                    {/* Page Header */}
                    <div className="dashboard-greeting">
                        <div className="flex items-center gap-3">
                            <h2 className="flex items-center gap-2">
                                <GitBranch className="size-6" />
                                {repo.repo_name}
                            </h2>
                            <Badge variant={repo.is_active ? "default" : "secondary"} className={repo.is_active ? "bg-green-500/15 text-green-600 hover:bg-green-500/25" : ""}>
                                {repo.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <p className="font-mono text-sm opacity-60">{repo.id}</p>
                    </div>

                    {/* Settings Sections */}
                    <div className="space-y-8 mt-8">
                        {/* Activation Section */}
                        <section>
                            <div className="stat-tile">
                                <div className="flex items-center justify-between w-full">
                                    <div className="space-y-1">
                                        <Label htmlFor="active-toggle" className="text-base font-medium">Enable Monitoring</Label>
                                        <p className="text-sm text-black font-medium">
                                            {repo.is_active
                                                ? "Delta is actively monitoring this repository for drift."
                                                : "Monitoring is paused. No updates will be processed."}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {toggleRepo.isPending && <span className="text-xs text-deep-blue animate-pulse">Updating...</span>}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                id="active-toggle"
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={repo.is_active}
                                                onChange={(e) => handleToggleActive(e.target.checked)}
                                                disabled={toggleRepo.isPending}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Documentation Automation Section */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4">Documentation Automation</h3>

                            <div className="stat-tile">
                                <div className="space-y-6 w-full">
                                    {/* Path and Branch Settings */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="docs-path">Documentation Path</Label>
                                            <Input
                                                id="docs-path"
                                                value={docsPath}
                                                onChange={(e) => setDocsPath(e.target.value)}
                                                placeholder="/docs"
                                            />
                                            <p className="text-xs text-black font-semibold">Where documentation lives in your repo.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="default-branch">Default Branch</Label>
                                            <Input
                                                id="default-branch"
                                                value={defaultBranch}
                                                onChange={(e) => setDefaultBranch(e.target.value)}
                                                placeholder="main"
                                            />
                                            <p className="text-xs text-black font-semibold">Branch to target for PRs.</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Sensitivity and Style */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="drift-sensitivity">Drift Sensitivity</Label>
                                                <span className="text-xs font-mono bg-ocean-city/10 text-ocean-city px-2 py-0.5 rounded-full border border-ocean-city/20">
                                                    {(driftSensitivity * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="relative pt-1">
                                                <input
                                                    id="drift-sensitivity"
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    value={driftSensitivity}
                                                    onChange={(e) => setDriftSensitivity(Number(e.target.value))}
                                                    className="w-full h-1.5 bg-glacial-salt/20 rounded-lg appearance-none cursor-pointer accent-ocean-city focus:outline-none"
                                                />
                                                <div className="flex justify-between text-[10px] mt-2 text-black font-semibold opacity-60 px-1">
                                                    <span>Low (0.0)</span>
                                                    <span>Medium (0.5)</span>
                                                    <span>High (1.0)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="style-preference">Style Preference</Label>
                                            <select
                                                id="style-preference"
                                                className="flex h-9 w-full rounded-md border border-glacial-salt/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ocean-city text-white"
                                                value={stylePreference}
                                                onChange={(e) => setStylePreference(e.target.value)}
                                            >
                                                <option className="text-black" value="Concise">Concise</option>
                                                <option className="text-black" value="Descriptive">Descriptive</option>
                                                <option className="text-black" value="Professional">Professional</option>
                                                <option className="text-black" value="Technical">Technical</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            onClick={handleSave}
                                            disabled={updateSettings.isPending}
                                            className="btn-primary-delta min-w-[140px]"
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
                        </section>
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
