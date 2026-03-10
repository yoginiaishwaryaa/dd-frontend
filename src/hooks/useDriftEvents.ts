import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DriftEvent, DriftEventDetail } from '@/types/drift'
import { isEventInProgress } from '@/types/drift'

/**
 * Hook to fetch all drift events for a repository
 */
export function useDriftEvents(repoId: string) {
  return useQuery({
    queryKey: ['driftEvents', repoId],
    queryFn: async () => {
      const response = await api.get<DriftEvent[]>(`/repos/${repoId}/drift-events`)
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    staleTime: 10 * 1000, // 10 seconds
    enabled: !!repoId,
  })
}

/**
 * Hook to fetch a single drift event with full details, findings, and code changes
 */
export function useDriftEventDetail(repoId: string, eventId: string) {
  return useQuery({
    queryKey: ['driftEventDetail', repoId, eventId],
    queryFn: async () => {
      const response = await api.get<DriftEventDetail>(`/repos/${repoId}/drift-events/${eventId}`)
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    staleTime: 5 * 1000, // 5 seconds for active events
    refetchInterval: (query) => {
      // Poll more frequently if event is in progress
      const data = query.state.data
      if (data && isEventInProgress(data.processing_phase)) {
        return 5000 // 5 seconds
      }
      return false // Don't poll for completed events
    },
    enabled: !!repoId && !!eventId,
  })
}
