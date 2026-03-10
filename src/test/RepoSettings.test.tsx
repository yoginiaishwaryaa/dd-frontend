import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RepoSettings from '../pages/RepoSettings'

const createTestQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

let mockUserReturn: any
let mockLogoutReturn: any
let mockReposReturn: any
let mockUpdateSettingsReturn: any
let mockToggleRepoReturn: any
let mockDriftEventsReturn: any

vi.mock('@/hooks/useUser', () => ({
    useCurrentUser: () => mockUserReturn,
    getGravatarUrl: () => 'avatar.png'
}))
vi.mock('@/hooks/useAuth', () => ({
    useLogout: () => mockLogoutReturn
}))
vi.mock('@/hooks/useRepos', () => ({
    useRepos: () => mockReposReturn,
    useUpdateRepoSettings: () => mockUpdateSettingsReturn,
    useToggleRepo: () => mockToggleRepoReturn
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
        data: [{
            id: '1',
            repo_name: 'org/repo1',
            is_active: true,
            docs_root_path: '/docs',
            target_branch: 'main',
            reviewer: 'test-reviewer',
            docs_policies: 'Test Policy',
            style_preference: 'technical'
        }],
        isLoading: false
    }
    mockUpdateSettingsReturn = { mutate: vi.fn(), isPending: false }
    mockToggleRepoReturn = { mutate: vi.fn(), isPending: false }
    mockDriftEventsReturn = { data: [], isLoading: false }
})

describe('RepoSettings Page', () => {
    it('renders repository settings', async () => {
        render(<RepoSettings />, { wrapper })
        expect((await screen.findAllByText('org/repo1')).length).toBeGreaterThan(0)
        expect(await screen.findByDisplayValue('/docs')).toBeInTheDocument()
        expect(await screen.findByDisplayValue('main')).toBeInTheDocument()
        expect(await screen.findByDisplayValue('test-reviewer')).toBeInTheDocument()
        expect(await screen.findByDisplayValue('Test Policy')).toBeInTheDocument()
    })

    it('calls save settings mutation when form logic is triggered', async () => {
        const user = userEvent.setup()
        render(<RepoSettings />, { wrapper })

        await user.clear(screen.getByLabelText('Documentation Path'))
        await user.type(screen.getByLabelText('Documentation Path'), '/new-docs')

        await user.clear(screen.getByLabelText('Reviewer GitHub ID'))
        await user.type(screen.getByLabelText('Reviewer GitHub ID'), 'new-reviewer')

        await user.click(screen.getByRole('button', { name: /Save Settings/i }))

        expect(mockUpdateSettingsReturn.mutate).toHaveBeenCalledWith(expect.objectContaining({
            id: '1',
            settings: expect.objectContaining({
                docs_root_path: '/new-docs',
                reviewer: 'new-reviewer'
            })
        }), expect.anything())
    })

    it('toggles repo monitoring', async () => {
        const user = userEvent.setup()
        render(<RepoSettings />, { wrapper })

        await user.click(screen.getByLabelText('Enable Monitoring'))

        expect(mockToggleRepoReturn.mutate).toHaveBeenCalledWith({ id: '1', is_active: false }, expect.anything())
    })
})
