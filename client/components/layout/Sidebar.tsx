"use client";

import { Bell, LayoutDashboardIcon, MessageSquareText, Settings, User, UsersRoundCollaboration, LogOutIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from 'cn';
import { logout } from '@/features/auth/api/auth.api';
import React from 'react';
import { toast } from '../ui/toast';

interface Props {

}

const Sidebar: React.FC<Props> = (props) => {

  const pathname = usePathname();

  const router = useRouter();

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
    {
      routeName: "Settings",
      routePath: "/settings",
      icon: <Settings size={18} />
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await logout();
      toast.add({
        type: "success",
        description: res.message
      });
      router.push("/auth/login");
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.add({
        type: "error",
        description: errMessage
      });
    }
  }

  return (
    <aside className='flex h-full flex-col px-8'>
      <div className='pt-6'>
        <Link href="/dashboard" className='flex items-center gap-2'>
          <Image src="/images/logo.svg" height={100} width={100} alt='company logo' className='w-10 h-10' />
          <h6 className='font-bold font-jetBrainsMono'>OrbitGrad</h6>
        </Link>
      </div>
      <nav aria-label="Main navigation" className='flex-1 space-y-1 mt-16'>
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
      <button onClick={handleLogout} className='flex justify-start pb-2 gap-3 items-center font-semibold cursor-pointer'>
        <LogOutIcon size={20} />
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
