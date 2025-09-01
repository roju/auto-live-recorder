import { platformMap } from "@/data/supported-platforms";

export type StreamingPlatform = {
  name: string // lowercase name like "tiktok"
  displayName: string // Capitalized name like "TikTok"
  liveUrlFromUsername: (username: string) => string;
  profileUrlFromUsername: (username: string) => string;
  usernameFromUrl: (url: string) => string;
}

export class Streamer {
  platform: StreamingPlatform;
  username: string;
  botStatus: "paused" | "monitoring" | "recording" | "error";
  liveStatus: "live" | "lagging" | "offline" | "unknown" | "error";
  lastLive: string; // ISO date string or "unknown"
  vods: number;
  autoRecord: boolean;
  vodPath: string; // Empty string = default path based on template

  constructor(
    platformName: string,
    username: string,
    botStatus: Streamer['botStatus'],
    liveStatus: Streamer['liveStatus'],
    lastLive: string,
    vods: number,
    autoRecord: boolean,
    vodPath: string,
  ) {
    const platform = platformMap.get(platformName);
    if (!platform) {
      throw new Error(`Invalid platform: ${platformName}`);
    }

    this.platform = platform;
    this.username = username;
    this.botStatus = botStatus;
    this.liveStatus = liveStatus;
    this.lastLive = lastLive;
    this.vods = vods;
    this.autoRecord = autoRecord;
    this.vodPath = vodPath;
  }

  get streamerId(): string {
    return `${this.platform.name}-${this.username}`;
  }

  cloneWith(changes: Partial<Streamer>): Streamer {
    return new Streamer(
      this.platform.name,
      this.username,
      changes.botStatus ?? this.botStatus,
      changes.liveStatus ?? this.liveStatus,
      changes.lastLive ?? this.lastLive,
      changes.vods ?? this.vods,
      changes.autoRecord ?? this.autoRecord,
      changes.vodPath ?? this.vodPath,
    );
  }
}