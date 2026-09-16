import { useState } from 'react';

interface SearchParams {
   [key: string]: string;
}

export function useSearchParams() {
   const searchParams = new URLSearchParams(window.location.search);
   const [params, setParams] = useState<SearchParams>({});

   for (const [key, value] of searchParams.entries()) {
      params[key] = value;
   }

   const updateParams = (newParams: SearchParams) => {
      for (const key in newParams) {
         if (newParams[key]) {
            searchParams.set(key, newParams[key]);
         } else {
            searchParams.delete(key);
         }
      }

      window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);

      setParams(newParams);
   };

   const updateParam = (key: string, value: string | number) => {
      updateParams({ ...params, [key]: String(value) });
   };

   return { params, updateParams, updateParam };
}
