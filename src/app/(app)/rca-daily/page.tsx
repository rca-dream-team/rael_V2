import RcaDailyPage from '@/components/page_comps/rca-daily';
import { fetchNews, fetchNewsCategories } from '@/sanity/queries/news';
import { News, NewsCategory } from '@/types/news';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import React from 'react';

export const revalidate = 15;

export const metadata: Metadata = {
   title: 'Rca Daily | RAEL',
   description: 'Rca Daily',
};

const getNews = async (userType?: string) => {
   const news: News[] = (await fetchNews()) || [];
   const isStudent = userType?.toLowerCase() === 'student';
   if (isStudent) return news;
   return news.filter((item) => !item.category?.classified);
};

const getCategories = async (userType?: string) => {
   const rawCategories: NewsCategory[] = (await fetchNewsCategories()) || [];
   const isStudent = userType?.toLowerCase() === 'student';
   const filtered = isStudent ? rawCategories : rawCategories.filter((c) => !c.classified);
   return filtered.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
};

const RcaDaily = async () => {
   const userType = cookies().get('user_type')?.value;
   const [news, categories] = await Promise.all([getNews(userType), getCategories(userType)]);

   return (
      <>
         <RcaDailyPage news={news} categories={categories} />
      </>
   );
};

export default RcaDaily;
