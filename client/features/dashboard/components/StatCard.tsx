import React from 'react';

interface StatCardProps {
  cardTitle: string;
  cardStat: string | number;
  cardDesc: string;
}

const StatCard: React.FC<StatCardProps> = (props) => {

  const { cardTitle, cardDesc, cardStat } = props;
  return (
    <div className='w-full h-35 p-5 flex flex-col justify-between rounded-xl bg-white border border-border'>
      <p className='text-secondary-text text-13 capitalize'>{cardTitle}</p>
      <h1 className='text-foreground font-bold text-3xl'>{cardStat}</h1>
      <p className='text-secondary-text text-13'>{cardDesc}</p>
    </div>
  );
}

export default StatCard;
