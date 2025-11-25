'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    let isAuthenticated = false;
    try {
        isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    } catch (e) {
        // localStorage is not available
    }
    
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col">
        <AppHeader />
        <SidebarInset>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
