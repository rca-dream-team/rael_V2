import RcaDailyPage from '@/components/page_comps/rca-daily';
import { fetchNews, fetchNewsCategories } from '@/sanity/queries/news';
import { News, NewsCategory } from '@/types/news';
import { cookies } from 'next/headers';

export const revalidate = 5;

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

export default async function Home() {
   const userType = cookies().get('user_type')?.value;
   const [news, categories] = await Promise.all([getNews(userType), getCategories(userType)]);

   return (
      <div className=" px-[5%] w-full flex flex-col items-center">
         <RcaDailyPage news={news} categories={categories} />
      </div>
   );
}
