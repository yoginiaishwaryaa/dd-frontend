import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DriftEvents from '../pages/DriftEvents'

const createTestQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

let mockUserReturn: any
let mockLogoutReturn: any
let mockReposReturn: any
let mockDriftEventsReturn: any

vi.mock('@/hooks/useUser', () => ({
    useCurrentUser: () => mockUserReturn,
    getGravatarUrl: () => 'avatar.png'
}))
vi.mock('@/hooks/useAuth', () => ({
    useLogout: () => mockLogoutReturn
}))
vi.mock('@/hooks/useRepos', () => ({
    useRepos: () => mockReposReturn
}))
vi.mock('@/hooks/useDriftEvents', () => ({
    useDriftEvents: () => mockDriftEventsReturn
}))
vi.mock('@/components/shared/NotificationBell', () => ({
    NotificationBell: () => <div>NotificationBell</div>
}))
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useParams: () => ({ repoId: '1' }) }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
)

beforeEach(() => {
    mockUserReturn = { data: { email: 'test@example.com', full_name: 'Test User' }, isLoading: false }
    mockLogoutReturn = { mutate: vi.fn(), isPending: false }
    mockReposReturn = {
        data: [{ id: '1', repo_name: 'org/repo1' }],
        isLoading: false
    }
    mockDriftEventsReturn = {
        data: [
            {
                id: 'event-1',
                pr_number: 101,
                processing_phase: 'completed',
                drift_result: 'clean',
                head_branch: 'feature-1',
                base_branch: 'main',
                created_at: new Date().toISOString()
            },
            {
                id: 'event-2',
                pr_number: 102,
                processing_phase: 'analyzing',
                drift_result: 'pending',
                head_branch: 'feature-2',
                base_branch: 'main',
                created_at: new Date().toISOString()
            }
        ],
        isLoading: false,
        refetch: vi.fn()
    }
})

describe('DriftEvents Page', () => {
    it('renders drift events', () => {
        render(<DriftEvents />, { wrapper })
        expect(screen.getByText('PR #101')).toBeInTheDocument()
        expect(screen.getByText('PR #102')).toBeInTheDocument()
    })

    it('filters events', async () => {
        const user = userEvent.setup()
        render(<DriftEvents />, { wrapper })

        await user.click(screen.getByRole('tab', { name: /In Progress/i }))
        expect(screen.queryByText('PR #101')).not.toBeInTheDocument()
        expect(screen.getByText('PR #102')).toBeInTheDocument()
    })

    it('displays repository name in breadcrumb', () => {
        render(<DriftEvents />, { wrapper })
        const links = screen.getAllByRole('link', { name: /org\/repo1/i })
        expect(links.length).toBeGreaterThan(0)
    })

    it('refreshes events', async () => {
        const user = userEvent.setup()
        render(<DriftEvents />, { wrapper })

        await user.click(screen.getByTitle('Refresh'))
        expect(mockDriftEventsReturn.refetch).toHaveBeenCalled()
    })
})
