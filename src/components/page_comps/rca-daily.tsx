'use client';
import RText from '@/components/constants/RighteousText';
import NewsCard from '@/components/page_comps/news/NewsCard';
import LayoutChanger from '@/components/ui/LayoutChanger';
import { News, NewsCategory } from '@/types/news';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next13-progressbar';
import { useEffect, useState } from 'react';
import CategoryChanger from '../ui/CategoryChanger';
import NewsList from './news/NewsList';
import NewsTile from './news/NewsTile';
interface RcaDailyPageProps {
   news: News[];
   categories: NewsCategory[];
}

const RcaDailyPage = ({ categories = [], news: initialNews = [] }: RcaDailyPageProps) => {
   const [layout, setLayout] = useLocalStorage<'grid' | 'list' | 'tile'>({
      key: 'layout',
      defaultValue: 'grid',
   });
   const [category, setCategory] = useLocalStorage<string>({
      key: 'category',
      defaultValue: categories[0]?._id,
   });
   const [news, setNews] = useState<News[]>(initialNews);
   const [newsFiltered, setNewsFiltered] = useState<News[]>(() => {
      const activeCat = category || categories[0]?._id;
      if (!activeCat) return initialNews;
      const filtered = initialNews.filter((item) => item?.category?._id === activeCat);
      return filtered.length > 0 ? filtered : initialNews;
   });

   useEffect(() => {
      setNews(initialNews);
   }, [initialNews]);

   const handleLayoutChange = (layout: 'grid' | 'list' | 'tile') => {
      setLayout(layout);
   };

   const handleCategoryChange = (category: NewsCategory) => {
      setCategory(category._id);
   };

   useEffect(() => {
      const activeCat = category || categories[0]?._id;
      if (!activeCat) {
         setNewsFiltered(news);
         return;
      }
      const filtered = news.filter((item) => item?.category?._id === activeCat);
      setNewsFiltered(filtered);
   }, [category, categories, news]);

   //console.log('news', news);

   return (
      <div className=" w-full lg:w-[80%] ">
         <div className="flex items-center justify-between w-full">
            <RText className="text-2xl">Rca News</RText>
            <CategoryChanger value={category} categories={categories} onChange={handleCategoryChange} />
            <LayoutChanger value={layout} onChange={handleLayoutChange} />
         </div>
         {/* <div>
            <p>{news.map((news)=>{
               news.category
            })}</p>
         </div> */}
         {layout === 'grid' ? (
            <div className="mt-5 grid gap-6 flex-wrap auto-rows-fr lg:grid-cols-3 sm:grid-cols-2">
               {newsFiltered.map((news) => (
                  <NewsCard key={news.slug.current} data={news} />
               ))}
            </div>
         ) : layout === 'list' ? (
            <div className="mt-5 flex flex-col gap-2">
               {newsFiltered.map((news) => (
                  <NewsList key={news.slug.current} data={news} />
               ))}
            </div>
         ) : (
            <div className="mt-5 grid auto-rows-fr gap-2 lg:grid-cols-2">
               {newsFiltered.map((news) => (
                  <NewsTile key={news.slug.current} data={news} />
               ))}
            </div>
         )}
      </div>
   );
};

export default RcaDailyPage;
