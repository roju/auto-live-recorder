import * as React from "react"
// import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Cookie,
  Settings2,
  Video,
} from "lucide-react"
import { useLocation } from 'react-router-dom'

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
          title: "Files",
          url: "#/settings/files",
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

  const location = useLocation();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild
                    className="cursor-default"
                    tooltip={item.title}
                    isActive = {location.pathname == item.url.substring(1)}
                  >
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {data.navSettings.map((item) => (
              <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild
                    className="cursor-default"
                    tooltip={item.title}
                  >
                      <a href={item.url}>
                        {item.icon && <item.icon />} 
                        <span>{item.title}</span>
                      </a>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild 
                          className="cursor-default"
                          isActive = {location.pathname == subItem.url.substring(1)}
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
