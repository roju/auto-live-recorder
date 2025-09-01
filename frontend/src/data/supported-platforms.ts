import { StreamingPlatform } from "@/types/app-types";

export const supportedPlatforms: readonly StreamingPlatform[] = [
  {
    name: 'tiktok',
    displayName: 'TikTok',
    liveUrlFromUsername: (username: string) => `https://www.tiktok.com/@${username}/live`,
    profileUrlFromUsername: (username: string) => `https://www.tiktok.com/@${username}`,
    usernameFromUrl: (url: string) => {
      const match = url.match(/tiktok\.com\/@([^\/?#]+)/);
      return match ? match[1] : '';
    }
  },
] as const

export const platformMap = new Map(
  supportedPlatforms.map(p => [p.name, p])
);