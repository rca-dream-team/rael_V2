'use client';
import React from 'react';
import BG from '../../components/constants/BG';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';
import Image from 'next/image';
import PText from '@/components/constants/PoppinText';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
   const [isLogin, setIsLogin] = React.useState(true);
   const pathname = usePathname();

   React.useEffect(() => {
      if (pathname === '/auth/login') {
         setIsLogin(true);
      } else if (pathname === '/auth/signup') {
         setIsLogin(false);
      }
   }, [pathname]);

   return (
      <div className="flex text-black overflow-hidden w-full bg-white max-h-screen">
         <div className="w-[45%] relative flex bg-black h-screen object-cover">
            <BG />
            <div className=" absolute right-0 flex flex-col bg-white trun -translate-y-[50%] top-[50%]">
               <div className=" absolute left-0 w-1/2 h-full bg-black "></div>
               <div className={`px-11 z-10 py-5 bg-black ${isLogin ? 'rounded-br-[3em]' : ''}`}></div>
               <Link
                  href="/auth/login"
                  className={` z-10 px-11 text- py-5 ${
                     !isLogin ? 'rounded-br-[3em] bg-black text-white' : 'rounded-l-[3em] bg-white text-black'
                  } `}
               >
                  LOGIN
               </Link>
               {/* <Link
                  href="/auth/signup"
                  className={` z-10 px-11 text- py-5 ${
                     isLogin ? 'rounded-tr-[3em] text-white bg-black' : 'rounded-l-[3em] text-black bg-white'
                  } `}
               >
                  SIGNUP
               </Link> */}
               <div
                  className={`px-11 z-10 border-none border-black border-0 py-5 bg-black ${
                     !isLogin ? 'rounded-tr-[3em]' : ''
                  } rounded-tr-[3em]`}
               ></div>
            </div>
         </div>
         <div className="relative flex flex-col justify-center items-center w-[55%]">
            <div className="flex flex-col w-full max-w-[400px] gap-y-9 items-center">
               <div className="flex gap-y-4 flex-col items-center">
                  <Image src="/logo.svg" alt="RAEL" width={100} height={100} />
                  <PText noDark>The book of Rwanda Coding Academy</PText>
               </div>
               {children}
            </div>
            <div className="max-w-[500px] absolute bottom-0 w-full">
               <Footer />
            </div>
         </div>
      </div>
   );
};

export default AuthLayout;
