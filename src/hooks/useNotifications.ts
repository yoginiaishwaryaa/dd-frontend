import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Notification } from '@/types/notification'

/**
 * Hook to fetch all notifications for the current user
 */
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get<Notification[]>('/notifications/')
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  })
}

/**
 * Hook to get unread notification count
 */
export function useUnreadCount() {
  const { data: notifications } = useNotifications()
  return notifications?.filter((n) => !n.is_read).length ?? 0
}

/**
 * Hook to mark a single notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch<Notification>(`/notifications/${notificationId}/read`)
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch<{ message: string }>('/notifications/read-all')
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook to delete a single notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.delete<{ message: string }>(`/notifications/${notificationId}`)
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook to delete all notifications
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<{ message: string }>('/notifications/')
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
