import { useQuery } from '@tanstack/react-query'
import md5 from 'md5'

const LOCAL_USER_KEY = 'delta-user'

export interface StoredUser {
    email: string
    full_name: string | null
}

export function getStoredUser(): StoredUser | null {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(LOCAL_USER_KEY)
    if (!raw) return null
    try {
        return JSON.parse(raw) as StoredUser
    } catch {
        return null
    }
}

export function setStoredUser(user: { email: string; name?: string | null; full_name?: string | null }) {
    if (typeof window === 'undefined') return
    const normalized: StoredUser = {
        email: user.email,
        full_name: user.full_name ?? user.name ?? null,
    }
    window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(normalized))
}

export function clearStoredUser() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(LOCAL_USER_KEY)
}

/**
 * Hook to fetch the current authenticated user
 * Uses localStorage to get user info
 */
export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            return getStoredUser()
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    })
}

/**
 * Generate a Gravatar URL from an email or string identifier
 * @param identifier - Email address or any string to hash
 * @param size - Image size in pixels (default: 80)
 * @returns Gravatar URL
 */
export function getGravatarUrl(identifier: string, size: number = 80): string {
    // If it looks like an email, use it directly; otherwise, create a fake email
    const email = identifier.includes('@')
        ? identifier.toLowerCase().trim()
        : `${identifier.toLowerCase().trim()}@placeholder.com`

    const hash = md5(email)
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=robohash`
}
