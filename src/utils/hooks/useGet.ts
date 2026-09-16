import { sanityClient } from '@/sanity/sanity.client';
import { useEffect, useState } from 'react';

interface Opts<T = any> {
   // eslint-disable-next-line no-unused-vars
   formatResponse: (res: any) => T;
   onMount?: boolean;
   defaultValue?: T;
}

export default function useGet<T = any>(query: string, opts?: Opts<T>) {
   const { onMount = true, defaultValue } = opts ?? {};
   const [data, setData] = useState<T | null>(defaultValue ?? null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const getData = async () => {
      try {
         const res = await sanityClient.fetch(query);
         const formattedResponse = opts?.formatResponse ? opts.formatResponse(res) : res;
         setData(formattedResponse);
         setLoading(false);
      } catch (error: any) {
         setError(error);
         setLoading(false);
      }
   };

   useEffect(() => {
      if (onMount) {
         getData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return { data, loading, error, getData };
}
