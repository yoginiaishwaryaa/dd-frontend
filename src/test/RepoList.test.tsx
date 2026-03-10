import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RepoList from '../pages/RepoList'

const createTestQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

let mockUserReturn: any
let mockLogoutReturn: any
let mockReposReturn: any

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
    mockReposReturn = {
        data: [
            { id: '1', repo_name: 'org/repo1', is_active: true },
            { id: '2', repo_name: 'org/repo2', is_active: false }
        ],
        isLoading: false,
        refetch: vi.fn()
    }
})

describe('RepoList Page', () => {
    it('shows loading state initially', () => {
        mockUserReturn.isLoading = true
        render(<RepoList />, { wrapper })
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders repository list', () => {
        render(<RepoList />, { wrapper })
        expect(screen.getByText('org/repo1')).toBeInTheDocument()
        expect(screen.getByText('org/repo2')).toBeInTheDocument()
    })

    it('handles refresh click', async () => {
        const user = userEvent.setup()
        render(<RepoList />, { wrapper })
        const refreshBtn = screen.getByTitle('Refresh')
        await user.click(refreshBtn)
        expect(mockReposReturn.refetch).toHaveBeenCalled()
    })
})
