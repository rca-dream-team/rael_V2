'use client';
import { misUrl } from '@/lib/constants';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent } from 'react';
import { LuLoader2, LuShieldAlert, LuUser, LuGraduationCap } from 'react-icons/lu';

export default function LoginIndex() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const redirect = searchParams?.get('redirect');
   const [loading, setLoading] = React.useState(false);
   const [mockLoading, setMockLoading] = React.useState<'STUDENT' | 'STAFF' | null>(null);

   const isMockAuth = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true';

   React.useEffect(() => {
      const getOauthToken = async () => {
         const token = searchParams?.get('token');
         if (!token) return;
         if (token) loginOrCreateUserFromToken(token);
      };
      getOauthToken();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const loginOrCreateUserFromToken = async (token: string) => {
      setLoading(true);
      try {
         const res = await axios.post('/api/auth/login', { token });
         const data = res.data.data;
         setCookie('mis_token', token, { maxAge: 60 * 60 * 24 * 30 });
         setCookie('rael_token', data.token, { maxAge: 60 * 60 * 24 * 30 });
         setCookie('user_type', data?.profile?.roles?.[0]?.roleName, { maxAge: 60 * 60 * 24 * 30 });
         window.location.href = (redirect as any) ?? '/';
      } catch (error) {
         console.error('Error logging in', error);
      } finally {
         setLoading(false);
      }
   };

   const loginWithMock = async (role: 'STUDENT' | 'STAFF') => {
      setMockLoading(role);
      try {
         const res = await axios.post('/api/auth/login', { mock: true, role });
         const data = res.data.data;
         setCookie('mis_token', data.misToken || 'mock-mis-token', { maxAge: 60 * 60 * 24 * 30 });
         setCookie('rael_token', data.token, { maxAge: 60 * 60 * 24 * 30 });
         setCookie('user_type', data?.profile?.roles?.[0]?.roleName, { maxAge: 60 * 60 * 24 * 30 });
         window.location.href = (redirect as any) ?? '/';
      } catch (error) {
         console.error('Error logging in with mock auth:', error);
      } finally {
         setMockLoading(null);
      }
   };

   const loginWithRCA = () => {
      setLoading(true);
      window.location.href = `${misUrl}/auth/login?redirect=${window.location.href}&oauth=true`;
   };

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push((redirect as any) ?? '/');
   };

   return (
      <form onSubmit={handleSubmit} className="flex-col w-full flex items-center gap-y-6 font-poppins">
         <button
            type="button"
            onClick={loginWithRCA}
            disabled={loading || mockLoading !== null}
            className="bg-black border-2 border-white hover:border-black truncate stylbtn text-white rounded-[3em] py-3 px-8 transition-all disabled:opacity-50"
         >
            {loading ? <LuLoader2 className="animate-spin text-xl" /> : <p className="z-50 relative">Login With MIS</p>}
         </button>
         <p className="text-xs text-gray-500 text-center max-w-[280px]">
            Sign in with your RCA MIS credentials. Accounts are synced automatically.
         </p>

         {/* Local Development Mock Auth Panel */}
         {isMockAuth && (
            <div className="mt-4 w-full max-w-[340px] rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 p-4 text-center">
               <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-900 mb-2">
                  <LuShieldAlert className="text-amber-600 text-sm" />
                  <span>Developer Mode Active</span>
               </div>
               <p className="text-[11px] text-amber-700 mb-3">
                  Off-campus bypass enabled. Quick-login without connecting to RCA MIS:
               </p>
               <div className="flex items-center justify-center gap-2">
                  <button
                     type="button"
                     onClick={() => loginWithMock('STUDENT')}
                     disabled={mockLoading !== null || loading}
                     className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-950 font-medium text-xs py-2 px-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                     {mockLoading === 'STUDENT' ? (
                        <LuLoader2 className="animate-spin text-xs" />
                     ) : (
                        <>
                           <LuGraduationCap className="text-amber-700" />
                           <span>Dev Student</span>
                        </>
                     )}
                  </button>

                  <button
                     type="button"
                     onClick={() => loginWithMock('STAFF')}
                     disabled={mockLoading !== null || loading}
                     className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-950 font-medium text-xs py-2 px-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                     {mockLoading === 'STAFF' ? (
                        <LuLoader2 className="animate-spin text-xs" />
                     ) : (
                        <>
                           <LuUser className="text-amber-700" />
                           <span>Dev Staff</span>
                        </>
                     )}
                  </button>
               </div>
            </div>
         )}
      </form>
   );
}
