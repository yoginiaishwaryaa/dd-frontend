import { Bell, Check } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '@/hooks/useNotifications'
import { formatNotificationTime } from '@/types/notification'

export function NotificationBell() {
  const { data: notifications, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllRead()

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0
  const recentNotifications = notifications?.slice(0, 5) ?? []

  const handleMarkRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    markRead.mutate(id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-lg hover:bg-white/20 transition-colors"
          title="Notifications"
        >
          <Bell className="size-5 text-deep-navy" weight={unreadCount > 0 ? 'fill' : 'duotone'} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-lg ring-2 ring-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-95 bg-deep-navy border-white/10 text-white p-0 shadow-xl">
        <DropdownMenuLabel className="flex items-center justify-between text-white px-4 py-3 border-b border-white/10 bg-deep-navy/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-white/70" weight="duotone" />
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
              disabled={markAllRead.isPending}
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        
        {isLoading ? (
          <div className="py-12 px-4 text-center">
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 px-4">
                  <div className="w-2 h-2 rounded-full bg-white/20 mt-1.5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Bell className="size-10 text-white/20 mx-auto mb-3" weight="duotone" />
            <p className="text-sm text-white/60 font-medium">No notifications yet</p>
            <p className="text-xs text-white/40 mt-1">
              You'll be notified when drift is detected
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-100">
            <div className="divide-y divide-white/5">
              {recentNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="group flex items-start gap-3 p-4 cursor-pointer hover:bg-white/5 focus:bg-white/5 transition-colors"
                  onClick={() => !notification.is_read && markRead.mutate(notification.id)}
                >
                  {/* Unread indicator */}
                  <div className="shrink-0 mt-1.5">
                    {!notification.is_read ? (
                      <div className="w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
                    ) : (
                      <div className="w-2 h-2" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`text-sm leading-relaxed ${notification.is_read ? 'text-white/60' : 'text-white font-medium'}`}>
                      {notification.content}
                    </p>
                    <p className="text-xs text-white/40">
                      {formatNotificationTime(notification.created_at)}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  {!notification.is_read && (
                    <button
                      onClick={(e) => handleMarkRead(notification.id, e)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded"
                      title="Mark as read"
                    >
                      <Check className="size-4 text-white/70" />
                    </button>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {recentNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5 p-0">
              <Link 
                to="/notifications" 
                className="flex items-center justify-center text-sm text-white hover:text-blue-300 transition-colors font-medium py-3"
                style={{ color: 'white' }}
              >
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

