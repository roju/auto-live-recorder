import * as React from "react"
import {
  Cookie,
  Settings2,
  Video,
} from "lucide-react"

import { NavSettings } from "@/components/nav-settings"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
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
          title: "Format",
          url: "#/settings/demo",
        },
        {
          title: "Logging",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <NavMain items={data.navMain} />
          <NavSettings items={data.navSettings} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
