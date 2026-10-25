"use client";

import { cn } from 'cn';
import { Bell, LayoutDashboardIcon, MessageSquareText, User, UsersRoundCollaboration } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {

}

const Sidebar: React.FC<Props> = (props) => {

  const pathname = usePathname();

  const navLinks = [
    {
      routeName: "Dashboard",
      routePath: "/dashboard",
      icon: <LayoutDashboardIcon size={18} />
    },
    {
      routeName: "My Profile",
      routePath: "/profile",
      icon: <User size={18} />
    },
    {
      routeName: "Messages",
      routePath: "/messages",
      icon: <MessageSquareText size={18} />
    },
    {
      routeName: "Network",
      routePath: "/network",
      icon: <UsersRoundCollaboration size={18} />
    },
    {
      routeName: "Notifications",
      routePath: "/notifications",
      icon: <Bell size={18} />
    },
  ];

  return (
    <aside className='flex h-full flex-col px-8'>
      <div className='pt-6'>
        <Link href="/dashboard" className='flex items-center gap-2'>
          <Image src="/images/logo.svg" height={100} width={100} alt='company logo' className='w-10 h-10' />
          <h6 className='font-bold font-jetBrainsMono'>CareerConnect</h6>
        </Link>
      </div>
      <nav aria-label="Main navigation" className='flex-1 space-y-1 mt-10'>
        <ul className='space-y-3'>
          {
            navLinks.map(item => (
              <li key={item.routeName} className={cn('py-3 hover:bg-main px-4 rounded-md', pathname === item.routePath ? 'bg-main text-primary font-semibold' : 'font-medium')}>
                <Link href={item.routePath} className='w-full h-full flex items-center gap-2'>
                  {item.icon}
                  <span>{item.routeName}</span>
                </Link>
              </li>
            ))
          }
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
