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
import { useLocation } from 'react-router-dom'
import { sidebarItems } from "@/data/sidebar-items";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const location = useLocation();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.navMain.map((item) => (
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
            {sidebarItems.navSettings.map((item) => (
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
