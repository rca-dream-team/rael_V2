import { fetchNewsBySlug } from '@/sanity/queries/news';
import { News } from '@/types/news';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IndexPage from './_index';
import { getComments } from '@/lib/mongodb';
import { IComment } from '@/types/comment';
import { cookies } from 'next/headers';
import { decodeToken } from '@/utils';

// export const revalidate = 15;
export const dynamic = 'force-dynamic';

const getNews = async (slug: string) => {
   // Add retry logic to make fetching more resilient
   const MAX_RETRIES = 5; // Increased from 2 to 5
   let retries = 0;
   let news = null;

   while (retries <= MAX_RETRIES) {
      try {
         // Add debug logging
         // //console.log(`Fetching news for slug: ${slug} (attempt ${retries + 1}/${MAX_RETRIES + 1})`);

         // Handle potential undefined NEXT_PUBLIC_SANITY_PROJECT_ID
         if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && !process.env.SANITY_TOKEN) {
            console.error('Missing Sanity configuration. Check environment variables.');
            await new Promise((resolve) => setTimeout(resolve, 800)); // Wait before retry
            retries++;
            continue;
         }

         news = await fetchNewsBySlug(slug);
         ////console.log('News fetch result:', news ? 'Found' : 'Not found');

         if (news) {
            return news; // Success, exit retry loop
         }

         // If news is null but no error was thrown, wait and retry
         retries++;
         if (retries <= MAX_RETRIES) {
            ////console.log(`News not found, retrying (${retries}/${MAX_RETRIES})...`);
            await new Promise((resolve) => setTimeout(resolve, 800)); // Increased from 500ms to 800ms
         }
      } catch (error) {
         console.error(`Error fetching news (attempt ${retries + 1}):`, error);
         retries++;
         if (retries <= MAX_RETRIES) {
            //console.log(`Fetch failed, retrying (${retries}/${MAX_RETRIES})...`);
            await new Promise((resolve) => setTimeout(resolve, 800)); // Increased from 500ms to 800ms
         }
      }
   }

   return news; // Will be null if all retries failed
};

export const generateMetadata = async ({ params }: any) => {
   try {
      const news: News = params?.slug ? await getNews(params?.slug) : null;

      if (!news) {
         return {
            title: 'Loading Article... | RAEL',
            description: 'Please wait while we load this article.',
         } as Metadata;
      }

      return {
         title: `${news?.title} | RAEL`,
         description: news?.excerpt,
         openGraph: {
            title: `${news?.title} | RAEL`,
            description: news?.excerpt,
            type: 'article',
            url: `https://rca.ac.rw/article/${news?.slug?.current}`,
            images: [news?.image],
         },
      } as Metadata;
   } catch (error) {
      console.error('Error generating metadata:', error);
      return {
         title: 'Loading... | RAEL',
         description: 'RAEL News',
      } as Metadata;
   }
};

const ArticlePage = async (props: any) => {
   if (!props?.params?.slug) {
      //console.log('No slug provided');
      return notFound();
   }

   // Always try to get the news, with extended retries
   const news: News = await getNews(props?.params?.slug);

   // If no news after all retries, show not found instead of error
   if (!news) {
      //console.log('News not found for slug:', props?.params?.slug);
      return notFound();
   }

   //console.log('News fetched successfully:', news.title);

   // Use try-catch for getComments to prevent it from breaking the page
   let comments: IComment[] = [];
   try {
      if (news._id) {
         // Read session token to compute likedByUser and isOwner securely on the server
         const token = cookies().get('rael_token');
         const currentUser = token ? decodeToken(token.value) : null;
         const currentUserId = currentUser?.id || currentUser?._id;

         // Add retry logic for comments (only retrying on actual DB failures when result === null)
         const MAX_RETRIES = 2;
         let retries = 0;

         while (retries <= MAX_RETRIES) {
            try {
               const result = await getComments(news._id, currentUserId);

               if (result !== null) {
                  // Successful query (whether 0 comments or populated comments)
                  comments = result;
                  break; // Exit loop immediately with 0ms wasted
               }

               // Database connection dropped or returned an error (result === null)
               retries++;
               if (retries <= MAX_RETRIES) {
                  console.warn(`[Comments DB] Connection dropped. Retrying (${retries}/${MAX_RETRIES})...`);
                  await new Promise((resolve) => setTimeout(resolve, 250 * retries)); // Fast backoff: 250ms, 500ms
               }
            } catch (error) {
               console.error(`[Comments DB] Fetch exception (attempt ${retries + 1}):`, error);
               retries++;
               if (retries <= MAX_RETRIES) {
                  await new Promise((resolve) => setTimeout(resolve, 250 * retries));
               }
            }
         }
      } else {
         //console.log('No news ID available to fetch comments');
      }
   } catch (commentsError) {
      console.error('Error in comments fetch block:', commentsError);
      // Continue with empty comments array
   }

   // We have the news content, render the page
   return <IndexPage news={news} comments={comments} />;
};

export default ArticlePage;
