import { loadPreferences, savePreferences } from "@/lib/preferences"
import { VisibilityState } from '@tanstack/react-table'
import { Preferences } from '../lib/preferences'

export interface PreferenceSlice {
    prefs: Partial<Preferences>
    prefsHydrated: boolean
    hydratePrefs: () => Promise<Preferences | undefined>
    persistPrefs: (prefs: Partial<Preferences>) => Promise<void>
}

export const DEFAULT_COLUMN_VIS: VisibilityState = {
    platform: false,
    auto_record: true,
    last_live: true,
    vods: true,
}

export const DEFAULT_PREFS: Partial<Preferences> = {
    root_folder: '',
    vod_path_template: 'VODs/{platform}/{user}/{date}_{time}.mp4',
    dashboard_column_visibility: DEFAULT_COLUMN_VIS
}

export const createPreferenceSlice = (set: any, get: any): PreferenceSlice => ({
    prefs: DEFAULT_PREFS,
    prefsHydrated: false,
    hydratePrefs: async () => {
        if (get().prefsHydrated) return
        try {
            const prefs = await loadPreferences()
            console.log("Hydrated preferences:", prefs)
            set({ prefs })
            return prefs
        } catch (e) {
            console.error('Error loading preferences:', e)
        } finally {
            set({ prefsHydrated: true }) // Avoid blocking UI indefinitely
        }
    },
    persistPrefs: async (prefs: Partial<Preferences>) => {
        try {
            set({ prefs })
            const currentPrefs = await loadPreferences()
            await savePreferences({ ...currentPrefs, ...prefs })
        } catch (e) {
            console.error('Error saving preferences:', e)
        }
    },
})