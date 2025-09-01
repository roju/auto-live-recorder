import { loadPreferences, savePreferences } from "@/lib/preferences"
import { VisibilityState } from '@tanstack/react-table'

export interface PreferenceSlice {
    dashboardColumnVis: VisibilityState
    dashboardColumnVisHydrated: boolean
    hydrateDashboardColumnVis: () => Promise<void>
    persistDashboardColumnVis: (vis: VisibilityState) => Promise<void>
}

export const DEFAULT_COLUMN_VIS: VisibilityState = {
    platform: false,
    auto_record: false,
    last_live: true,
    vods: true,
}

export const createPreferenceSlice = (set: any, get: any): PreferenceSlice => ({
    dashboardColumnVis: DEFAULT_COLUMN_VIS,
    dashboardColumnVisHydrated: false,
    hydrateDashboardColumnVis: async () => {
        if (get().dashboardColumnVisHydrated) return
        try {
            const prefs = await loadPreferences()
            const vis = (prefs.dashboard_column_visibility) as VisibilityState
            set({ dashboardColumnVis: vis})
        } catch (e) {
            console.error('Error loading prefs.dashboard_column_visibility:', e)
        } finally {
            set({ dashboardColumnVisHydrated: true }) // Avoid blocking UI indefinitely
        }
    },
    persistDashboardColumnVis: async (vis: VisibilityState) => {
        try {
            set({ dashboardColumnVis: vis })
            const prefs = await loadPreferences()
            await savePreferences({ ...prefs, dashboard_column_visibility: vis as any })
        } catch (e) {
            console.error('Error saving dashboard column visibility:', e)
        }
    },
})