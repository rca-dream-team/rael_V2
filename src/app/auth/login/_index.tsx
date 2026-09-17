'use client';
import { misUrl } from '@/lib/constants';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent } from 'react';
import { LuLoader2 } from 'react-icons/lu';

export default function LoginIndex() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const redirect = searchParams?.get('redirect');
   const [loading, setLoading] = React.useState(false);
   const [rcaLoading, setRcaLoading] = React.useState(false);

   React.useEffect(() => {
      const getOauthToken = async () => {
         const token = searchParams?.get('token');
         if (!token) return;
         // const decoded = decodeToken(token);
         // //console.log('decoded token', decoded);
         if (token) loginOrCreateUserFromToken(token);
      };
      getOauthToken();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const loginOrCreateUserFromToken = async (token: string) => {
      setLoading(true);
      try {
         const res = await axios.post('/api/auth/login', { token });
         //console.log(res.data);
         const data = res.data.data;
         setRcaLoading(true);
         setCookie('mis_token', token, { maxAge: 60 * 60 * 24 * 30 });
         setCookie('rael_token', data.token, { maxAge: 60 * 60 * 24 * 30 });
         setCookie('user_type', data?.profile?.roles?.[0]?.roleName, { maxAge: 60 * 60 * 24 * 30 });
         //console.log('user created if not exists');
         window.location.href = (redirect as any) ?? '/';
      } catch (error) {
         console.error('Error logging in', error);
      }
      setLoading(false);
   };

   const loginWithRCA = () => {
      setLoading(true);
      window.location.href = `${misUrl}/auth/login?redirect=${window.location.href}&oauth=true`;
   };

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      //console.log('login');
      // setCookie('rael_token', '1234');
      router.push((redirect as any) ?? '/');
   };
   return (
      <form onSubmit={handleSubmit} className={' flex-col w-full flex items-center gap-y-6 font-poppins '}>
         <button
            type="submit"
            onClick={loginWithRCA}
            disabled={loading}
            className="bg-black border-2 border-white hover:border-black truncate stylbtn text-white rounded-[3em] py-3 px-8"
         >
            {loading ? <LuLoader2 className=" animate-spin" /> : <p className="z-50 relative">Login With MIS</p>}
         </button>
         <p className="text-xs text-gray-500 text-center max-w-[280px]">
            Sign in with your RCA MIS credentials. Accounts are synced automatically.
         </p>
      </form>
   );
}
