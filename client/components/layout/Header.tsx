"use client";
import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/queries/useAuth';

interface Props {

}

const Header: React.FC<Props> = (props) => {
  const { user, isLoading } = useAuth();



  const initials = user
    ? `${user?.firstName[0] ?? ""}${user?.lastName[0] ?? ""}`.toUpperCase() : "";
  console.log(initials);

  return (
    <header className='w-full bg-white h-20  border-b border-border px-8 flex justify-between items-center'>
      <div>

      </div>
      <div className='flex items-center gap-2'>
        <Bell color='#64748B' />
        <Avatar className="bg-primary text-white grid place-items-center">
          {/* <AvatarImage
            src={""}
            alt={user ? `${user.firstName} ${user.lastName}` : "User"}
            className="grayscale"
          /> */}
          <AvatarFallback> {initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default Header;
