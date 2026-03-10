import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Notifications from '../pages/Notifications'

const createTestQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

let mockUserReturn: any
let mockLogoutReturn: any
let mockNotificationsReturn: any
let mockMarkReadReturn: any
let mockMarkAllReadReturn: any
let mockDeleteReturn: any
let mockDeleteAllReturn: any

vi.mock('@/hooks/useUser', () => ({
    useCurrentUser: () => mockUserReturn,
    getGravatarUrl: () => 'avatar.png'
}))
vi.mock('@/hooks/useAuth', () => ({
    useLogout: () => mockLogoutReturn
}))
vi.mock('@/hooks/useNotifications', () => ({
    useNotifications: () => mockNotificationsReturn,
    useMarkNotificationRead: () => mockMarkReadReturn,
    useMarkAllRead: () => mockMarkAllReadReturn,
    useDeleteNotification: () => mockDeleteReturn,
    useDeleteAllNotifications: () => mockDeleteAllReturn
}))
vi.mock('@/components/shared/NotificationBell', () => ({
    NotificationBell: () => <div>NotificationBell</div>
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
)

beforeEach(() => {
    mockUserReturn = { data: { email: 'test@example.com', full_name: 'Test User' }, isLoading: false }
    mockLogoutReturn = { mutate: vi.fn(), isPending: false }
    mockNotificationsReturn = {
        data: [
            { id: '1', content: 'Test Notification 1', is_read: false, created_at: new Date().toISOString() },
            { id: '2', content: 'Test Notification 2', is_read: true, created_at: new Date().toISOString() }
        ],
        isLoading: false
    }
    mockMarkReadReturn = { mutate: vi.fn(), isPending: false }
    mockMarkAllReadReturn = { mutate: vi.fn(), isPending: false }
    mockDeleteReturn = { mutate: vi.fn(), isPending: false }
    mockDeleteAllReturn = { mutate: vi.fn(), isPending: false }

    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true))
})

describe('Notifications Page', () => {
    it('renders notifications', () => {
        render(<Notifications />, { wrapper })
        expect(screen.getByText('Test Notification 1')).toBeInTheDocument()
        expect(screen.getByText('Test Notification 2')).toBeInTheDocument()
    })

    it('filters unread notifications', async () => {
        const user = userEvent.setup()
        render(<Notifications />, { wrapper })

        await user.click(screen.getByText(/Unread/))
        expect(screen.getByText('Test Notification 1')).toBeInTheDocument()
        expect(screen.queryByText('Test Notification 2')).not.toBeInTheDocument()
    })

    it('marks all as read', async () => {
        const user = userEvent.setup()
        render(<Notifications />, { wrapper })

        await user.click(screen.getByText('Mark all read'))
        expect(mockMarkAllReadReturn.mutate).toHaveBeenCalled()
    })

    it('deletes all notifications', async () => {
        const user = userEvent.setup()
        render(<Notifications />, { wrapper })

        await user.click(screen.getByText('Delete all'))
        expect(mockDeleteAllReturn.mutate).toHaveBeenCalled()
    })
})
