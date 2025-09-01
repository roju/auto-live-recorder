import * as PreferenceService from "../../wailsjs/go/main/PreferenceService";
import { Streamer } from "../types/app-types"

export interface Preferences {
  theme: string
  root_folder: string
  vod_path_template: string
  dashboard_column_visibility: { [key: string]: boolean }
}

export async function loadPreferences(): Promise<Preferences> {
  return await PreferenceService.LoadPreferences()
}

export async function savePreferences(prefs: Preferences): Promise<void> {
  await PreferenceService.SavePreferences(prefs)
}

export async function loadStreamerList(): Promise<Streamer[]> {
  const listClass = await PreferenceService.LoadStreamerList() || []
  if (!listClass || !listClass["streamer-list"]) {
    return []
  }
  const convertedList = listClass["streamer-list"].map(s => new Streamer(
    s.platform,
    s.username,
    s.paused ? "paused" : "monitoring",
    "unknown",
    s.last_live,
    s.vods,
    s.auto_record,
    s.vod_path,
  ))
  return convertedList
}

export async function saveStreamerList(list: Streamer[]): Promise<void> {
  const streamerList = {
    "streamer-list": list.map(s => ({
      platform: s.platform.name,
      username: s.username,
      paused: s.botStatus === "paused",
      last_live: s.lastLive,
      vods: s.vods,
      auto_record: s.autoRecord,
      vod_path: s.vodPath,
    })),
    convertValues: (obj: any) => obj
  };
  await PreferenceService.SaveStreamerList(streamerList);
}