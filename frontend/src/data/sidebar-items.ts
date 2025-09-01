import {
  Cookie,
  Settings2,
  Video,
} from "lucide-react"

export const sidebarItems = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#/dashboard",
      icon: Video,
    },
    {
      title: "Cookies",
      url: "#/cookies",
      icon: Cookie,
    },
  ],
  navSettings: [
    {
      title: "Settings",
      url: "#/settings/general",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#/settings/general",
        },
        {
          title: "Files",
          url: "#/settings/files",
        },
      ],
    },
  ]
}