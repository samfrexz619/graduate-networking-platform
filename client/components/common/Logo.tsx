import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


interface LogoProp {
  link: string;
}

const Logo: React.FC<LogoProp> = ({ link }) => {
  return (
    <>
      <Link href={`/${link}`} className="flex items-center gap-2">
        <Image src="/images/logo.svg" height={45} width={45} alt="company logo" className="size-11.25" />
        <h6 className="font-bold">CareerConnect</h6>
      </Link>
    </>
  )
}

export default Logo;