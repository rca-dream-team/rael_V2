import { Metadata } from 'next';
import { Righteous } from 'next/font/google';
import React from 'react';
import './globals.css';
import Providers from './providers';

// export const poppins = Poppins({
//   weight: ["400", "500", "600", "700", "800"],
//   subsets: ["latin"],
// });
const righteous = Righteous({ weight: ['400'], subsets: ['latin'] });

export const metadata: Metadata = {
   metadataBase: new URL('https://rca-rael.vercel.app'),
   title: 'RAEL',
   description: 'All you need to know about RCA and the RCA community',
   openGraph: {
      type: 'website',
      locale: 'en_IE',
      url: 'https://rca-rael.vercel.app/',
      siteName: 'RAEL',
      description: 'All you need to know about RCA and the RCA community',
   },
};

type Props = { children: any; modal: React.ReactNode; params: any };

export default function RootLayout(props: Props) {
   const { children, modal } = props;

   return (
      <html lang="en">
         <head>
            <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
         </head>
         <body className={righteous.className}>
            <Providers>
               {children}
               {modal}
            </Providers>
         </body>
      </html>
   );
}
