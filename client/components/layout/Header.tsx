import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props {

}

const Header: React.FC<Props> = (props) => {
  return (
    <header className='w-full bg-white h-20  border-b border-border px-8 flex justify-between items-center'>
      <div>

      </div>
      <div className='flex items-center gap-2'>
        <Bell />
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default Header;
