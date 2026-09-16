import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Signup - RAEL',
   description: 'Signup for your RAEL account',
};

function Layout({ children }: { children: React.ReactNode }) {
   return <>{children}</>;
}

export default Layout;
