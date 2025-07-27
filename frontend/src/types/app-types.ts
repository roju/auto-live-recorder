export type SocialMediaUser = {
  id: number
  platform: string
  username: string
  botStatus: "paused" | "monitoring" | "recording" | "error"
  liveStatus: "live" | "lagging" | "offline" | "unknown" | "error"
  lastLive: string // ISO date string or "unknown"
  vods: number,
  autoRecord: boolean
}