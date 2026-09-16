import React from 'react';
import LoginIndex from './_index';
import { PageProps } from '@/types';
import { Metadata } from 'next';

const metadata = {
   title: 'Login - RAEL',
   description: 'Login to your RAEL account',
};

export const generateMetadata = ({ searchParams }: PageProps): Metadata => {
   //console.log('searchParams', searchParams);
   const redirect = searchParams?.redirect;
   if (redirect && redirect !== '/') {
      return {};
   }
   return metadata;
};

const LoginPage = () => {
   return <LoginIndex />;
};

export default LoginPage;
