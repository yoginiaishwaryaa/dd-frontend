import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  // Example client state
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        theme: 'light',
        sidebarOpen: true,
        
        // Actions
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      }),
      {
        name: 'app-storage', // localStorage key
      }
    )
  )
)
