import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getShortRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears}y`;
  if (diffMonths > 0) return `${diffMonths}mo`;
  if (diffWeeks > 0) return `${diffWeeks}w`;
  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  if (diffMin > 0) return `${diffMin}m`;
  return `${diffSec}s`;
}

export function isValidDate(dateString: string): boolean {
  // Attempt to create a Date object from the string.
  const dateObject = new Date(dateString)

  // Check if the created Date object is a valid date (not "Invalid Date").
  // isNaN(dateObject.getTime()) returns true if the date is invalid.
  return !isNaN(dateObject.getTime())
}

export const supportedPlatforms = [
    { label: "TikTok", value: "tiktok" },
] as const

export function getLiveURL(platform: string, username: string): string {
  switch (platform) {
    case "tiktok":
      return `https://www.tiktok.com/@${username}/live`
    default: return ''
  }
}