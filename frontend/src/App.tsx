import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Demo from './Demo.tsx'
import Dashboard from './Dashboard.tsx'
import SettingsDemo from './screens/SettingsDemo.tsx'
import Dashboard from './screens/Dashboard.tsx'

const DynamicHashBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.substring(1).split('/').filter(Boolean);
  // console.log("location", location);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '#' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);

    return (
      <React.Fragment key={href}>
        <BreadcrumbItem>
          <BreadcrumbPage>
            {capitalizedSegment}
          </BreadcrumbPage>
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings/general" element={<SettingsGeneral />} />
      <Route path="/settings/demo" element={<SettingsDemo />} />
    </Routes>
  )
}

function App() {
  return (
    <HashRouter basename={"/"}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <DynamicHashBreadcrumbs />
              </div>
            </header>
            <AppRoutes />
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </HashRouter>
  )
}

export default App
