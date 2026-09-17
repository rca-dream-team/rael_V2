'use client';

import { useEffect } from 'react';
import ArticleLoading from './loading';

export default function ArticleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
   useEffect(() => {
      // Log the error but don't show it to the user
      // console.error('Article error occurred (hidden from user):', error);

      // Automatically retry after 2 seconds
      const timer = setTimeout(() => {
         // //console.log('Auto-retrying after error...');
         reset();
      }, 2000);

      return () => clearTimeout(timer);
   }, [error, reset]);

   // Instead of showing an error, we show the loading component
   // This makes the error "invisible" to the user
   return <ArticleLoading />;
}
