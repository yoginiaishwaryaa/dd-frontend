import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ArrowLeft, Check, Trash, SignOut } from '@phosphor-icons/react'
import { Button } from '@/components/shadcn/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from '@/hooks/useNotifications'
import { useCurrentUser, getGravatarUrl } from '@/hooks/useUser'
import { useLogout } from '@/hooks/useAuth'
import { formatNotificationTime, type Notification } from '@/types/notification'
import { toast } from 'sonner'

function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div
      className={`repo-row group transition-all ${!notification.is_read ? 'bg-white/5 border-l-2 border-blue-400' : 'border-l-2 border-transparent'}`}
      onClick={() => !notification.is_read && onMarkRead(notification.id)}
    >
      <div className="repo-row-info">
        {/* Unread indicator */}
        <div className="shrink-0 w-6 flex items-center justify-center">
          {!notification.is_read && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
          )}
        </div>

        {/* Content */}
        <div className="repo-row-text flex-1">
          <p className={`text-sm leading-relaxed ${notification.is_read ? 'text-white/60' : 'text-white font-medium'}`}>
            {notification.content}
          </p>
          <p className="repo-row-description text-xs mt-1">
            {formatNotificationTime(notification.created_at)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="repo-row-meta flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.is_read && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-green-500/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onMarkRead(notification.id)
            }}
            title="Mark as read"
          >
            <Check className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-red-400 hover:bg-red-500/20 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(notification.id)
          }}
          title="Delete"
        >
          <Trash className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function NotificationRowSkeleton() {
  return (
    <div className="repo-row">
      <div className="repo-row-info">
        <div className="w-6" />
        <div className="repo-row-text flex-1">
          <Skeleton className="h-4 w-full max-w-md mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const { data: notifications, isLoading, error } = useNotifications()
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { mutate: logout, isPending: logoutPending } = useLogout()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllRead()
  const deleteNotification = useDeleteNotification()
  const deleteAll = useDeleteAllNotifications()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = '/login'
      },
    })
  }

  const handleMarkRead = (id: string) => {
    markRead.mutate(id, {
      onSuccess: () => toast.success('Marked as read'),
    })
  }

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id, {
      onSuccess: () => toast.success('Notification deleted'),
    })
  }

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success('All notifications marked as read'),
    })
  }

  const handleDeleteAll = () => {
    if (window.confirm('Delete all notifications? This cannot be undone.')) {
      deleteAll.mutate(undefined, {
        onSuccess: () => toast.success('All notifications deleted'),
      })
    }
  }

  // Filter notifications
  const filteredNotifications = notifications?.filter((n) => {
    if (filter === 'unread') return !n.is_read
    return true
  })

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0

  // Loading state
  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ocean-city border-r-transparent" />
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
          <div className="geo-dot d1" />
          <div className="geo-dot d2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild title="Back to Dashboard">
              <Link to="/dashboard">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <Link to="/dashboard" className="dashboard-logo">
              <div className="dashboard-logo-icon">
                <img src="/logo.png" alt="Delta Logo" className="size-full object-contain p-1" />
              </div>
              <h1 className="dashboard-logo-text">
                Delta<span>.</span>
              </h1>
            </Link>
          </div>
          <div className="dashboard-user">
            <img
              src={getGravatarUrl(user.email)}
              alt="User avatar"
              className="dashboard-user-avatar"
            />
            <div className="dashboard-user-info">
              <p className="dashboard-user-name">{user.full_name || 'User'}</p>
              <p className="dashboard-user-email">{user.email}</p>
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
              { label: 'Notifications' }
            ]}
            className="mb-4"
          />

          {/* Page Header */}
          <div className="dashboard-greeting">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-deep-blue/50 rounded-lg">
                <Bell className="size-6 text-white" weight="duotone" />
              </div>
              <div className="flex-1">
                <h2 className="flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                      {unreadCount} new
                    </span>
                  )}
                </h2>
                <p className="text-sm">Stay updated on your repositories and drift analysis</p>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="flex-1">
              <TabsList className="bg-deep-blue/30">
                <TabsTrigger value="all" className="data-[state=active]:bg-deep-blue data-[state=active]:text-white text-white/60">
                  All Notifications
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-deep-blue data-[state=active]:text-white text-white/60">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllRead}
                  disabled={markAllRead.isPending}
                  className="border-green-400/40 text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-colors"
                >
                  <Check className="size-4 mr-1.5" />
                  Mark all read
                </Button>
              )}
              {(notifications?.length ?? 0) > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAll}
                  disabled={deleteAll.isPending}
                  className="border-blue-400/40 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 transition-colors"
                >
                  <Trash className="size-4 mr-1.5" />
                  Delete all
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="dashboard-repos-list">
            {isLoading ? (
              <>
                <NotificationRowSkeleton />
                <NotificationRowSkeleton />
                <NotificationRowSkeleton />
              </>
            ) : error ? (
              <div className="dashboard-repos-empty py-16">
                <div className="p-4 bg-red-500/10 rounded-lg mb-4">
                  <Bell className="size-12 text-red-400 mx-auto mb-2" weight="duotone" />
                </div>
                <p className="text-red-400 font-medium text-lg mb-2">Error loading notifications</p>
                <p className="text-white/50 text-sm">Please try refreshing the page</p>
              </div>
            ) : filteredNotifications?.length === 0 ? (
              <div className="dashboard-repos-empty py-16">
                <div className="p-4 bg-deep-blue/30 rounded-lg mb-4">
                  <Bell className="size-12 text-white/40 mx-auto" weight="duotone" />
                </div>
                <p className="text-white/70 font-medium text-lg mb-2">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-white/50 text-sm">
                  {filter === 'unread'
                    ? 'All caught up! Check back later for new updates.'
                    : 'Notifications appear when drift is detected or PRs are created'}
                </p>
              </div>
            ) : (
              filteredNotifications?.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>
            By using Delta, you agree to our <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>
          </p>
        </footer>
      </div>
    </div>
  )
}
