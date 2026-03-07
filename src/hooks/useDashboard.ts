import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DashboardStats, Repository } from '@/types/repo'

/**
 * Hook to fetch dashboard statistics
 * Returns counts for installations, repos linked, drift events, and PRs waiting
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const response = await api.get<DashboardStats>('/dashboard/stats')
            if (response.error) {
                throw new Error(response.error)
            }
            return response.data!
        },
        staleTime: 30 * 1000, // 30 seconds - stats update frequently
        refetchInterval: 60 * 1000, // Refetch every minute
    })
}

/**
 * Hook to fetch dashboard repositories
 * Returns the 5 most recent repositories linked by the user
 */
export function useDashboardRepos() {
    return useQuery({
        queryKey: ['dashboardRepos'],
        queryFn: async () => {
            const response = await api.get<Repository[]>('/dashboard/repos')
            if (response.error) {
                throw new Error(response.error)
            }
            return response.data!
        },
        staleTime: 60 * 1000, // 1 minute
    })
}
