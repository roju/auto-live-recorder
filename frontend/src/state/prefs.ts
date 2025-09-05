import { loadPreferences, savePreferences } from "@/lib/preferences"
import { VisibilityState } from '@tanstack/react-table'
import { Preferences } from '../lib/preferences'

export interface PreferenceSlice {
    prefs: Partial<Preferences>
    prefsHydrated: boolean
    hydratePrefs: () => Promise<Preferences>
    persistPrefs: (prefs: Partial<Preferences>) => Promise<void>
}

export const DEFAULT_COLUMN_VIS: VisibilityState = {
    platform: false,
    auto_record: true,
    last_live: true,
    vods: true,
}

export const DEFAULT_PREFS: Partial<Preferences> = {
    theme: 'system',
    root_folder: '',
    vod_path_template: 'VODs/{platform}/{user}/{date}_{time}.mp4',
    dashboard_column_visibility: DEFAULT_COLUMN_VIS
}

export const createPreferenceSlice = (set: any, get: any): PreferenceSlice => ({
    prefs: DEFAULT_PREFS,
    prefsHydrated: false,
    hydratePrefs: async () => {
        if (get().prefsHydrated) return get().prefs
        try {
            const loadedPrefs = await loadPreferences()
            console.log("Hydrated preferences:", loadedPrefs)
            // Merge loaded preferences with defaults to ensure all required properties exist
            const mergedPrefs = { ...DEFAULT_PREFS, ...loadedPrefs }
            set({ prefs: mergedPrefs, prefsHydrated: true })
            return mergedPrefs as Preferences
        } catch (e) {
            console.error('Error loading preferences:', e)
            // On error, use default preferences and mark as hydrated
            set({ prefs: DEFAULT_PREFS, prefsHydrated: true })
            return DEFAULT_PREFS as Preferences
        }
    },
    persistPrefs: async (prefs: Partial<Preferences>) => {
        try {
            const currentPrefs = get().prefs
            const updatedPrefs = { ...currentPrefs, ...prefs }
            set({ prefs: updatedPrefs })
            
            // Load preferences from storage to merge with updates
            const storedPrefs = await loadPreferences()
            const mergedPrefs = { ...DEFAULT_PREFS, ...storedPrefs, ...prefs }
            await savePreferences(mergedPrefs)
            console.log("Saved preferences:", mergedPrefs)
        } catch (e) {
            console.error('Error saving preferences:', e)
        }
    },
})