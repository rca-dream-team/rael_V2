'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import Link from 'next/link';

export default function Error({
   error,
   reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   useEffect(() => {
      // Log the error to an error reporting service
      console.error('Application error:', error);
   }, [error]);

   return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
         <div className="max-w-md">
            <BiErrorCircle className="text-red-500 text-7xl mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
               We&apos;re having trouble loading this page. Our team has been notified about this issue.
            </p>
            
            {error.digest && (
               <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                  Error reference: {error.digest}
               </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button
                  onClick={() => reset()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
               >
                  Try again
               </button>
               <Link 
                  href="/"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
               >
                  Return home
               </Link>
            </div>
         </div>
      </div>
   );
}
