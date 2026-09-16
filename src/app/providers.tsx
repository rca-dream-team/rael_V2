'use client';
import AuthProvider from '@/contexts/AuthProvider';
import React from 'react';
import AppProvider from '../contexts/AppProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
   return (
      <AuthProvider>
         <AppProvider>{children}</AppProvider>
      </AuthProvider>
   );
};

export default Providers;
