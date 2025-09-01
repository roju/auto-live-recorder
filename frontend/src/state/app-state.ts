import { create } from 'zustand'
import { StreamerSlice, createStreamerSlice } from './streamers'
import { PreferenceSlice, createPreferenceSlice } from './prefs'

export type AppStore = StreamerSlice & PreferenceSlice

export const appStore = create<AppStore>((set, get) => ({
    ...createStreamerSlice(set),
    ...createPreferenceSlice(set, get),
}))