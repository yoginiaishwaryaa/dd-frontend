// Dashboard Stats from /dashboard/stats endpoint
export interface DashboardStats {
    installations_count: number
    repos_linked_count: number
    drift_events_count: number
    pr_waiting_count: number
}

// Repository from /dashboard/repos endpoint
export interface Repository {
    id: string
    name: string
    description: string | null
    language: string | null
    stargazers_count: number
    forks_count: number
    avatar_url: string | null
}
