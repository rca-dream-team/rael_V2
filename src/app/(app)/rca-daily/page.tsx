import RcaDailyPage from '@/components/page_comps/rca-daily';
import { fetchNews, fetchNewsByCategory } from '@/sanity/queries/news';
import { News } from '@/types/news';
import { Metadata } from 'next';
import React from 'react';

export const revalidate = 15;

export const metadata: Metadata = {
   title: 'Rca Daily | RAEL',
   description: 'Rca Daily',
};

const RcaDaily = async () => {
   const res: News[] = await fetchNews;
   // const filteredNews = await fetchNewsByCategory();
   return (
      <>
         <RcaDailyPage news={res} categories={[]} />
      </>
   );
};

export default RcaDaily;
