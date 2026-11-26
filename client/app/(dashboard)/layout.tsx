import React from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import QueryProvider from '../providers/QueryProvider';



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </QueryProvider>

  );
}
