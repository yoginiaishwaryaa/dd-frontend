import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Repository {
    id: string
    installation_id: number
    repo_name: string
    is_active: bool
    is_suspended: bool
    avatar_url: string | null
    docs_root_path: string
    target_branch: string
    drift_sensitivity: number
    style_preference: string
    file_ignore_patterns: string[] | null
    last_synced_at: string | null
    created_at: string
}

export interface RepositorySettings {
    drift_sensitivity?: number
    style_preference?: string
    target_branch?: string
    docs_root_path?: string
}

export interface RepositoryActivation {
    is_active: bool
}

export function useRepos() {
    return useQuery({
        queryKey: ['repos'],
        queryFn: async () => {
            const response = await api.get<Repository[]>('/repos/')
            if (response.error) throw new Error(response.error)
            return response.data!
        },
    })
}

export function useUpdateRepoSettings() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, settings }: { id: string; settings: RepositorySettings }) => {
            const response = await api.put<Repository>(`/repos/${id}/settings`, settings)
            if (response.error) throw new Error(response.error)
            return response.data!
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repos'] })
        },
    })
}

export function useToggleRepo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
            const response = await api.patch<Repository>(`/repos/${id}/activate`, { is_active })
            if (response.error) throw new Error(response.error)
            return response.data!
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repos'] })
        },
    })
}
