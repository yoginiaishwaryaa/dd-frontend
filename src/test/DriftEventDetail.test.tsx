import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DriftEventDetail from '../pages/DriftEventDetail'

const createTestQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

let mockUserReturn: any
let mockLogoutReturn: any
let mockReposReturn: any
let mockEventDetailReturn: any

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
    useDriftEventDetail: () => mockEventDetailReturn
}))
vi.mock('@/components/shared/NotificationBell', () => ({
    NotificationBell: () => <div>NotificationBell</div>
}))
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useParams: () => ({ repoId: '1', eventId: 'event-1' }) }
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
    mockEventDetailReturn = {
        data: {
            id: 'event-1',
            pr_number: 101,
            processing_phase: 'completed',
            drift_result: 'drift_detected',
            head_branch: 'feature-1',
            base_branch: 'main',
            created_at: new Date().toISOString(),
            overall_drift_score: 85,
            findings: [
                {
                    id: 'finding-1',
                    code_path: 'src/file.ts',
                    change_type: 'modified',
                    drift_type: 'outdated_docs',
                    drift_score: 90,
                    explanation: 'This is a drift finding explanation'
                }
            ],
            code_changes: [
                {
                    id: 'change-1',
                    file_path: 'src/file.ts',
                    change_type: 'modified',
                    is_code: true,
                    is_ignored: false
                }
            ]
        },
        isLoading: false
    }
})

describe('DriftEventDetail Page', () => {
    it('renders event details and findings', () => {
        render(<DriftEventDetail />, { wrapper })
        expect(screen.getAllByText('PR #101').length).toBeGreaterThan(0)
        expect(screen.getByText('feature-1 → main')).toBeInTheDocument()
    })

    it('renders drift findings in accordion', async () => {
        const user = userEvent.setup()
        render(<DriftEventDetail />, { wrapper })

        expect(screen.getByText('src/file.ts')).toBeInTheDocument()

        // Open accordion
        const findingTrigger = screen.getByText('src/file.ts').closest('button') as HTMLElement
        await user.click(findingTrigger)

        expect(screen.getByText('This is a drift finding explanation')).toBeInTheDocument()
    })

    it('shows code changes section', async () => {
        render(<DriftEventDetail />, { wrapper })

        const showFilesTrigger = screen.getByText(/Show 1 file/i)
        expect(showFilesTrigger).toBeInTheDocument()
    })
})
