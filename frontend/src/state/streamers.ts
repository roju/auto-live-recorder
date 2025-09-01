import { Streamer } from '@/types/app-types'
import { loadStreamerList, saveStreamerList } from "@/lib/preferences"

export interface StreamerSlice {
    streamerList: Streamer[]
    hydrateStreamerList: () => Promise<void>
    addStreamer: (newStreamer: Streamer) => Promise<void>
    removeStreamer: (streamerId: string) => Promise<void>
    updateStreamer: (streamer: Streamer, changes: Partial<Streamer>) => Promise<void>
    updateAllStreamers: (updates: Array<{streamer: Streamer, changes: Partial<Streamer>}>) => Promise<void>
    removeAllStreamers: () => Promise<void>
}

export const createStreamerSlice = (set: any): StreamerSlice => ({
    streamerList: [],
    hydrateStreamerList: async () => {
        try {
            const loadedList = await loadStreamerList()
            set({ streamerList: loadedList })
        } catch (error) {
            console.error("Error hydrating streamer list:", error)
        }
    },
    addStreamer: async (newStreamer: Streamer) => {
        try {
            const loadedList = await loadStreamerList()
            if (loadedList.some((s: Streamer) => s.streamerId === newStreamer.streamerId)) {
                // Do not add if streamerId already exists
                return
            }
            await saveStreamerList([...loadedList, newStreamer])
            set((state: any) => ({
                streamerList: [...state.streamerList, newStreamer]
            }))
        } catch (error) {
            console.error("Error adding streamer:", error)
        }
    },
    removeStreamer: async (streamerId: string) => {
        try {
            const loadedList = await loadStreamerList()
            const updatedList = loadedList.filter((s: Streamer) => s.streamerId !== streamerId)
            await saveStreamerList(updatedList)
            set((state: any) => ({
                streamerList: state.streamerList.filter((s: Streamer) => s.streamerId !== streamerId)
            }))
        } catch (error) {
            console.error("Error removing streamer:", error)
        }
    },
    updateStreamer: async (streamer: Streamer, changes: Partial<Streamer>) => {
        try {
            const newStreamer = streamer.cloneWith(changes)
            const loadedList = await loadStreamerList()
            const updatedList = loadedList.map((s: Streamer) =>
                s.streamerId === newStreamer.streamerId ? newStreamer : s
            )
            await saveStreamerList(updatedList)
            set((state: any) => ({
                streamerList: state.streamerList.map((s: Streamer) =>
                    s.streamerId === newStreamer.streamerId ? newStreamer : s
                )
            }))
        } catch (error) {
            console.error("Error updating streamer:", error)
        }
    },
    updateAllStreamers: async (updates: Array<{streamer: Streamer, changes: Partial<Streamer>}>) => {
        try {
            const loadedList = await loadStreamerList()
            const updatedList = loadedList.map((s: Streamer) => {
                const update = updates.find(u => u.streamer.streamerId === s.streamerId)
                return update ? update.streamer.cloneWith(update.changes) : s
            })
            await saveStreamerList(updatedList)
            set((state: any) => ({
                streamerList: state.streamerList.map((s: Streamer) => {
                    const update = updates.find(u => u.streamer.streamerId === s.streamerId)
                    return update ? update.streamer.cloneWith(update.changes) : s
                })
            }))
        } catch (error) {
            console.error("Error updating all streamers:", error)
        }
    },
    removeAllStreamers: async () => {
        try {
            await saveStreamerList([])
            set(() => ({ streamerList: [] }))
        } catch (error) {
            console.error("Error removing all streamers:", error)
        }
    },
})