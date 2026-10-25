import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {

}

const AuthBanner: React.FC<Props> = (props) => {
  return (
    <>
      <div>
        <Link href={"/login"} className="flex items-center gap-2">
          <Image src="/images/logo.svg" height={45} width={45} alt="company logo" className="size-11.25" />
          <h6 className="font-bold">CareerConnect</h6>
        </Link>
      </div>

      <section className="pt-20">
        <div className="space-y-6">
          <h6 className="text-xs font-bold text-primary">YOUR NEXT CHAPTER STARTS HERE</h6>

          <h2 className="text-[44px] font-bold leading-[125%]">
            Great careers start with real connections.
          </h2>

          <p>Find your people, grow your skills and take your next step with confidence.</p>
          <Image src="/images/authLayoutBgg.avif" alt="" height={100} width={100} className="w-137 h-full rounded-2xl bg-contain" />

          <div className="flex gap-3 items-center">
            <Image src="/images/authLayout2.png" alt="" height={50} width={100} />
            <p className="text-[13px]">Built for the first steps of your career.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default AuthBanner;
