import { authRoutes, whitelist } from '@/middleware';
import { IStudent } from '@/types/member.type';
import { decodeToken } from '@/utils';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useContext, useEffect } from 'react';

interface AuthContextProps {
   user: IStudent | null;
   setUser: React.Dispatch<React.SetStateAction<any>>;
   getProfile: () => Promise<any>;
}

const AuthContext = React.createContext<AuthContextProps>({
   user: null,
   setUser: () => {},
   getProfile: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = React.useState<IStudent | null>(null);
   const [loading, setLoading] = React.useState(true);
   const pathname = usePathname();
   const router = useRouter();

   const getProfile = async () => {
      if (authRoutes.some((path) => pathname?.includes(path))) {
         setLoading(false);
         return;
      }
      try {
         const decoded = decodeToken();
         const role = decoded.role ?? getCookie('user_type');
         const schema = role?.toString().toLowerCase() === 'student' ? 'student' : 'staff';
         const res = await axios.get(`/api/profile?user_type=${schema}`);
         setUser(res.data.data);
      } catch (error) {
         deleteCookie('rael_token');
         deleteCookie('user_type');
         deleteCookie('mis_token');
      }
      setLoading(false);
   };

   useEffect(() => {
      setLoading(true);
      getProfile();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   if (!loading && !user && !authRoutes.some((path) => pathname?.includes(path))) {
      router.push(`/auth/login?redirect=${pathname}`);
      return null;
   }

   if (loading) {
      return <div className=" flex w-full h-screen justify-center items-center">Loading ...</div>;
   }

   return <AuthContext.Provider value={{ user, setUser, getProfile }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
