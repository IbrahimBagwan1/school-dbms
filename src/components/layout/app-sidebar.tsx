'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BrainCircuit,
  School,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 items-center justify-center gap-2 border-b px-4 lg:h-[60px] lg:px-6 group-data-[collapsible=icon]:h-[60px] group-data-[collapsible=icon]:justify-center">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold text-primary md:text-base"
        >
          <School className="h-6 w-6" />
          <span className="sr-only group-data-[collapsible=icon]:hidden">ScholarSight</span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">
          ScholarSight
        </h1>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive('/dashboard')}
            tooltip="Dashboard"
          >
            <Link href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive('/students')}
            tooltip="Students"
          >
            <Link href="/students">
              <Users />
              Students
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive('/teachers')}
            tooltip="Teachers"
          >
            <Link href="/teachers">
              <GraduationCap />
              Teachers
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive('/courses')}
            tooltip="Courses"
          >
            <Link href="/courses">
              <BookOpen />
              Courses
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive('/predict-failure')}
            tooltip="Predict Failure"
          >
            <Link href="/predict-failure">
              <BrainCircuit />
              Predict Failure
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}
