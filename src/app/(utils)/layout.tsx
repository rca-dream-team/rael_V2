import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Import Data - Rael',
   description: 'Import data from other services',
};

const ImportLayout = ({ children }: { children: React.ReactNode }) => {
   return <div className="flex h-screen w-full justify-center items-center flex-col">{children}</div>;
};

export default ImportLayout;
