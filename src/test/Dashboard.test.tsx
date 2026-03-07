import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

// ---- Mock Data ----
const mockUser = {
    id: '1',
    email: 'john@example.com',
    full_name: 'John Doe',
}

const mockStats = {
    installations_count: 3,
    repos_linked_count: 12,
    drift_events_count: 5,
    pr_waiting_count: 2,
}

const mockRepos = [
    { id: '1', name: 'delta-frontend', description: 'Frontend app', language: 'TypeScript', stargazers_count: 42, forks_count: 8, avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' },
    { id: '2', name: 'delta-backend', description: 'Backend API', language: 'Python', stargazers_count: 30, forks_count: 5, avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4' },
    { id: '3', name: 'delta-docs', description: null, language: 'Markdown', stargazers_count: 10, forks_count: 2, avatar_url: null },
    { id: '4', name: 'delta-cli', description: 'CLI tool', language: 'Go', stargazers_count: 15, forks_count: 3, avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4' },
    { id: '5', name: 'delta-sdk', description: 'SDK library', language: 'TypeScript', stargazers_count: 20, forks_count: 4, avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4' },
    { id: '6', name: 'delta-infra', description: 'Infrastructure', language: 'Terraform', stargazers_count: 5, forks_count: 1, avatar_url: 'https://avatars.githubusercontent.com/u/6?v=4' },
    { id: '7', name: 'delta-design', description: 'Design system', language: 'CSS', stargazers_count: 8, forks_count: 0, avatar_url: null },
]

// ---- Mock Return Values (mutable per-test) ----
let mockUserReturn: any
let mockLogoutReturn: any
let mockStatsReturn: any
let mockReposReturn: any

// ---- Mock Hooks ----
vi.mock('@/hooks/useUser', () => ({
    useCurrentUser: () => mockUserReturn,
    getGravatarUrl: (_identifier: string) => `https://gravatar.com/avatar/mock?d=robohash`,
}))

vi.mock('@/hooks/useAuth', () => ({
    useLogout: () => mockLogoutReturn,
}))

vi.mock('@/hooks/useDashboard', () => ({
    useDashboardStats: () => mockStatsReturn,
    useDashboardRepos: () => mockReposReturn,
}))

// Wrapper component for tests
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

beforeEach(() => {
    // Reset to default mock values before each test
    mockUserReturn = { data: mockUser, isLoading: false }
    mockLogoutReturn = { mutate: vi.fn(), isPending: false }
    mockStatsReturn = { data: mockStats, isLoading: false, refetch: vi.fn() }
    mockReposReturn = { data: mockRepos.slice(0, 3), isLoading: false, refetch: vi.fn() }
})

// ========================================
// LOADING STATE
// ========================================
describe('Dashboard - Loading State', () => {
    // Render loading indicator while user fetch is in progress
    it('shows a loading spinner when user data is loading', () => {
        mockUserReturn = { data: undefined, isLoading: true }
        render(<Dashboard />, { wrapper })

        expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })

    // Still show loading if the user object is null (not yet resolved)
    it('shows a loading spinner when user is null', () => {
        mockUserReturn = { data: null, isLoading: false }
        render(<Dashboard />, { wrapper })

        expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })
})

// ========================================
// HEADER & BRANDING
// ========================================
describe('Dashboard - Header & Branding', () => {
    // Verify the "Delta" heading is visible in the header
    it('renders the Delta logo text', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByRole('heading', { name: /Delta/i })).toBeInTheDocument()
    })

    // Check the logo image element and its src attribute
    it('renders the logo image', () => {
        render(<Dashboard />, { wrapper })

        const logoImg = screen.getByAltText('Delta Logo')
        expect(logoImg).toBeInTheDocument()
        expect(logoImg).toHaveAttribute('src', '/logo.png')
    })

    // Logo anchor should navigate back to /dashboard
    it('logo links to the dashboard', () => {
        render(<Dashboard />, { wrapper })

        const logoLink = screen.getByRole('link', { name: /Delta\./ })
        expect(logoLink).toHaveAttribute('href', '/dashboard')
    })
})

// ========================================
// USER INFO
// ========================================
describe('Dashboard - User Info', () => {
    // User's full name should appear in the header
    it('displays the user full name', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // User's email should appear in the header
    it('displays the user email', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    // Gravatar avatar should render with the correct src
    it('displays a user avatar', () => {
        render(<Dashboard />, { wrapper })

        const avatar = screen.getByAltText('User avatar')
        expect(avatar).toBeInTheDocument()
        expect(avatar.getAttribute('src')).toContain('gravatar.com')
    })

    // Empty full_name should fall back to display "User"
    it('falls back to "User" if full_name is missing', () => {
        mockUserReturn = { data: { ...mockUser, full_name: '' }, isLoading: false }
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('User')).toBeInTheDocument()
    })
})

// ========================================
// GREETING
// ========================================
describe('Dashboard - Greeting', () => {
    // Greeting should include the user's first name
    it('shows a personalized welcome message with first name', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText(/Welcome back, John/i)).toBeInTheDocument()
    })

    // Missing full_name should greet with "there" instead
    it('falls back to "there" when full_name is missing', () => {
        mockUserReturn = { data: { ...mockUser, full_name: '' }, isLoading: false }
        render(<Dashboard />, { wrapper })

        expect(screen.getByText(/Welcome back, there/i)).toBeInTheDocument()
    })

    // Subtitle text below the greeting
    it('shows the overview subtitle', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText(/Here's an overview of your linked repositories/i)).toBeInTheDocument()
    })
})

// ========================================
// STAT TILES
// ========================================
describe('Dashboard - Stat Tiles', () => {
    // All four stat tile labels should be present
    it('renders all four stat tile labels', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('Installations')).toBeInTheDocument()
        expect(screen.getByText('Repos Linked')).toBeInTheDocument()
        expect(screen.getByText('Drift Events')).toBeInTheDocument()
        expect(screen.getByText('PRs Waiting')).toBeInTheDocument()
    })

    // Stat values should match the mock data
    it('displays the correct stat values', () => {
        const { container } = render(<Dashboard />, { wrapper })

        const statValues = container.querySelectorAll('.stat-tile-value')
        const values = Array.from(statValues).map(el => el.textContent)
        expect(values).toContain('3')
        expect(values).toContain('12')
        expect(values).toContain('5')
        expect(values).toContain('2')
    })

    // Null stats should gracefully show 0 for all tiles
    it('displays 0 when stats are null', () => {
        mockStatsReturn = { data: null, isLoading: false, refetch: vi.fn() }
        render(<Dashboard />, { wrapper })

        const zeroValues = screen.getAllByText('0')
        expect(zeroValues.length).toBe(4)
    })

    // Loading state should show labels but not real values
    it('shows skeletons when stats are loading', () => {
        mockStatsReturn = { data: undefined, isLoading: true, refetch: vi.fn() }
        render(<Dashboard />, { wrapper })

        // Stat labels should still render, but values should be skeletons
        expect(screen.getByText('Installations')).toBeInTheDocument()
        expect(screen.queryByText('3')).not.toBeInTheDocument()
    })
})

// ========================================
// REPOSITORIES LIST
// ========================================
describe('Dashboard - Repositories List', () => {
    // Section header should read "Recent Repositories"
    it('renders the "Recent Repositories" header', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('Recent Repositories')).toBeInTheDocument()
    })

    // Each repo name from mock data should appear
    it('renders repository names', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('delta-frontend')).toBeInTheDocument()
        expect(screen.getByText('delta-backend')).toBeInTheDocument()
        expect(screen.getByText('delta-docs')).toBeInTheDocument()
    })

    // Repo descriptions should be displayed
    it('renders repository descriptions', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('Frontend app')).toBeInTheDocument()
        expect(screen.getByText('Backend API')).toBeInTheDocument()
    })

    // Null description should fall back to "No description"
    it('shows "No description" when repo description is null', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('No description')).toBeInTheDocument()
    })

    // Language badges should render for each repo
    it('renders language badges for repos with a language', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('TypeScript')).toBeInTheDocument()
        expect(screen.getByText('Python')).toBeInTheDocument()
        expect(screen.getByText('Markdown')).toBeInTheDocument()
    })

    // Star and fork counts should be visible
    it('renders star and fork counts', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText('42')).toBeInTheDocument()
        expect(screen.getByText('8')).toBeInTheDocument()
    })

    // Repo name should link to /repos/:id
    it('links each repo name to its detail page', () => {
        render(<Dashboard />, { wrapper })

        const repoLink = screen.getByRole('link', { name: 'delta-frontend' })
        expect(repoLink).toHaveAttribute('href', '/repos/1')
    })

    // Each repo row should have an avatar from the API (avatar_url)
    it('renders repo avatars using returned avatar_url', () => {
        render(<Dashboard />, { wrapper })

        const avatars = screen.getAllByAltText('')
        expect(avatars.length).toBeGreaterThan(0)
        // First repo has avatar_url set
        expect(avatars[0].getAttribute('src')).toContain('avatars.githubusercontent.com')
    })
})

// ========================================
// EMPTY STATE
// ========================================
describe('Dashboard - Empty State', () => {
    // Empty repo list should show the "No repositories linked" message
    it('shows empty state when no repos are linked', () => {
        mockReposReturn = { data: [], isLoading: false, refetch: vi.fn() }
        render(<Dashboard />, { wrapper })

        expect(screen.getByText(/No repositories linked yet/i)).toBeInTheDocument()
        expect(screen.getByText(/Connect your GitHub account to get started/i)).toBeInTheDocument()
    })
})

// ========================================
// LOADING SKELETONS (REPOS)
// ========================================
describe('Dashboard - Repos Loading', () => {
    // Loading repos should not show empty state or real data
    it('shows skeleton rows when repos are loading', () => {
        mockReposReturn = { data: undefined, isLoading: true, refetch: vi.fn() }
        render(<Dashboard />, { wrapper })

        // Should not show the empty state
        expect(screen.queryByText(/No repositories linked yet/i)).not.toBeInTheDocument()
        // Should not show any repo names
        expect(screen.queryByText('delta-frontend')).not.toBeInTheDocument()
    })
})

// ========================================
// SHOW MORE / SHOW LESS
// ========================================
describe('Dashboard - Show More / Show Less', () => {
    // No pagination button needed for small lists
    it('does not show "Show More" when there are 5 or fewer repos', () => {
        mockReposReturn = { data: mockRepos.slice(0, 3), isLoading: false, refetch: vi.fn() }
        render(<Dashboard />, { wrapper })

        expect(screen.queryByText(/Show More/i)).not.toBeInTheDocument()
    })

    // Button should appear with count of hidden repos
    it('shows "Show More" button when there are more than 5 repos', () => {
        mockReposReturn = { data: mockRepos, isLoading: false, refetch: vi.fn() }
        render(<Dashboard />, { wrapper })

        expect(screen.getByText(/Show More \(2 more\)/i)).toBeInTheDocument()
    })

    // Clicking Show More / Show Less expands and collapses the list
    it('toggles between showing all repos and limited repos', async () => {
        const user = userEvent.setup()
        mockReposReturn = { data: mockRepos, isLoading: false, refetch: vi.fn() }
        render(<Dashboard />, { wrapper })

        // Initially only 5 repos shown
        expect(screen.queryByText('delta-infra')).not.toBeInTheDocument()
        expect(screen.queryByText('delta-design')).not.toBeInTheDocument()

        // Click "Show More"
        const showMoreBtn = screen.getByText(/Show More/i)
        await user.click(showMoreBtn)

        // All 7 repos visible now
        expect(screen.getByText('delta-infra')).toBeInTheDocument()
        expect(screen.getByText('delta-design')).toBeInTheDocument()

        // Button now says "Show Less"
        expect(screen.getByText(/Show Less/i)).toBeInTheDocument()

        // Click "Show Less"
        await user.click(screen.getByText(/Show Less/i))

        // Back to 5 repos
        expect(screen.queryByText('delta-infra')).not.toBeInTheDocument()
        expect(screen.queryByText('delta-design')).not.toBeInTheDocument()
    })
})

// ========================================
// ACTION BUTTONS
// ========================================
describe('Dashboard - Action Buttons', () => {
    // "Link Repository" should point to the GitHub app install URL
    it('renders the "Link Repository" button with GitHub install link', () => {
        render(<Dashboard />, { wrapper })

        const linkRepoBtn = screen.getByText(/Link Repository/i)
        expect(linkRepoBtn).toBeInTheDocument()

        // The button should be inside an anchor linking to GitHub
        const anchor = linkRepoBtn.closest('a')
        expect(anchor).toHaveAttribute('href', 'https://github.com/apps/delta-docs/installations/new')
    })

    // "Manage Repos" should link to the internal /repos route
    it('renders the "Manage Repos" button linking to /repos', () => {
        render(<Dashboard />, { wrapper })

        const manageBtn = screen.getByText(/Manage Repos/i)
        expect(manageBtn).toBeInTheDocument()

        const link = manageBtn.closest('a')
        expect(link).toHaveAttribute('href', '/repos')
    })
})

// ========================================
// LOGOUT
// ========================================
describe('Dashboard - Logout', () => {
    // Sign out button should exist in the header
    it('renders a sign out button', () => {
        render(<Dashboard />, { wrapper })

        const logoutBtn = screen.getByTitle('Sign out')
        expect(logoutBtn).toBeInTheDocument()
    })

    // Clicking sign out should trigger the logout mutation
    it('calls logout when clicked', async () => {
        const mockLogoutFn = vi.fn()
        mockLogoutReturn = { mutate: mockLogoutFn, isPending: false }

        const user = userEvent.setup()
        render(<Dashboard />, { wrapper })

        const logoutBtn = screen.getByTitle('Sign out')
        await user.click(logoutBtn)

        expect(mockLogoutFn).toHaveBeenCalledOnce()
    })
})

// ========================================
// FOOTER
// ========================================
describe('Dashboard - Footer', () => {
    // Footer should contain legal links
    it('renders the footer with Terms of Service and Privacy Policy links', () => {
        render(<Dashboard />, { wrapper })

        expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument()
        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument()
    })
})

// ========================================
// BACKGROUND DECORATIONS
// ========================================
describe('Dashboard - Background', () => {
    // Verify the correct number of decorative background elements
    it('renders the animated background with triangles and dots', () => {
        const { container } = render(<Dashboard />, { wrapper })

        const triangles = container.querySelectorAll('.geo-triangle')
        const dots = container.querySelectorAll('.geo-dot')

        expect(triangles.length).toBe(25)
        expect(dots.length).toBe(4)
    })
})
