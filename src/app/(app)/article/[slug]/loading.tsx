'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { BiArrowBack } from 'react-icons/bi';
import Link from 'next/link';

export default function ArticleLoading() {
  return (
    <div className="w-full flex top-0 flex-col items-center min-h-full flex-1 bg-opacity-10 relative">
      <div className="absolute top-0 left-0 w-full h-full dark:bg-black/90 bg-white/95 z-0"></div>
      <div className="w-full p-6 flex flex-col max-w-4xl z-10">
        <Link href="/" className="font-semibold mb-6 flex items-center gap-2 text-lg">
          <BiArrowBack />
          All news
        </Link>
        
        <div className="flex w-full flex-col font-poppins">
          {/* Article title */}
          <Skeleton className="h-12 w-3/4 mb-8" />
          
          {/* Author */}
          <Skeleton className="h-6 w-40 mb-12" />
          
          {/* Article content */}
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-24 w-5/6 mb-12" />
          
          {/* Comments section */}
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          
          <div className="flex items-center justify-center w-full mt-8">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 