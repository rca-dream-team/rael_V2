'use client';
import Footer from '@/components/shared/Footer';
import React from 'react';
import Header from '../../components/shared/Header';

interface MainAppLayoutProps {
   children: React.ReactNode;
}

const MainAppLayout = ({ children }: MainAppLayoutProps) => {
   return (
      <main className="flex dark:bg-black pb-14 overflow-y-auto h-screen bg-white w-full dark:text-white min-h-screen flex-col items-center">
         <Header />
         {children}
         <div className="flex  bg-white dark:bg-black fixed bottom-0 z-10 w-full">
            <Footer hasDark />
         </div>
      </main>
   );
};

export default MainAppLayout;
