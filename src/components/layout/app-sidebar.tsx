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
          <Link href="/dashboard" legacyBehavior passHref>
            <SidebarMenuButton
              isActive={isActive('/dashboard')}
              tooltip="Dashboard"
            >
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/students" legacyBehavior passHref>
            <SidebarMenuButton
              isActive={isActive('/students')}
              tooltip="Students"
            >
              <Users />
              Students
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/teachers" legacyBehavior passHref>
            <SidebarMenuButton
              isActive={isActive('/teachers')}
              tooltip="Teachers"
            >
              <GraduationCap />
              Teachers
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/courses" legacyBehavior passHref>
            <SidebarMenuButton
              isActive={isActive('/courses')}
              tooltip="Courses"
            >
              <BookOpen />
              Courses
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/predict-failure" legacyBehavior passHref>
            <SidebarMenuButton
              isActive={isActive('/predict-failure')}
              tooltip="Predict Failure"
            >
              <BrainCircuit />
              Predict Failure
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}
