"use client";

import React from 'react';
import StatCard from './StatCard';
import { useAuth } from '@/hooks/queries/useAuth';
import Link from 'next/link';




const DashboardView: React.FC = () => {

  const { user, isAuthenticated, isLoading } = useAuth();

  const hour = new Date().getHours();
  let greeting;

  switch (true) {
    case hour < 12:
      greeting = "Good morning";
      break;
    case hour < 18:
      greeting = "Good afternoon";
      break;
    default:
      greeting = "Good evening"
  }

  return (
    <section className='w-full p-8 space-y-6 max-w-285'>
      <div>
        <h2 className='text-foreground font-bold text-3xl'>{greeting}, {user?.firstName} 👋</h2>
        <p>A few meaningful steps towards your next chapter.</p>
      </div>
      <section className='w-full grid grid-cols-3 gap-4'>
        <StatCard cardTitle='Connections' cardDesc='+6 this month' cardStat={48} />
        <StatCard cardTitle='Role matches' cardDesc='4 new this week' cardStat={12} />
        <StatCard cardTitle='Mentor matches' cardDesc='Ready to help' cardStat={8} />
      </section>
      <section className='w-full flex'>
        <div className='w-200 space-y-6'>
          <div className='w-full h-41.5 rounded-xl border border-border bg-main p-5'>
            <div className='space-y-4.5'>
              <h6 className='text-14 font-semibold text-primary'>✦ AI insight · A clearer next step</h6>
              <p>Your profile strongly matches frontend development opportunities. Consider adding accessibility testing and Next.js to strengthen your profile.</p>
              <Link href="#" className='text-14 font-semibold text-primary'>Explore your recommendations →</Link>
            </div>
          </div>
          <div>
            <h3 className='font-semibold text-lg'>People to meet</h3>
            <div>

            </div>
          </div>
        </div>
        {/* right side */}
        <aside></aside>
      </section>
    </section>
  )
}

export default DashboardView;