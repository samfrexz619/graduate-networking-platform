import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';



interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className='bg-background min-h-screen'>
      {/* <p>welcome to dashboard</p> */}
      <div className='flex min-h-screen'>
        <aside className='hidden w-64 border-r border-border bg-white lg:block'>
          {/* sidebar */}
          <Sidebar />
        </aside>
        <div className='flex min-w-0 flex-1 flex-col bg-sec-bg'>
          {/* header */}
          <Header />
          <main>
            {children}

          </main>
        </div>
      </div>
    </div>
  );
}


