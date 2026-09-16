import React, { useEffect, useRef, useState } from 'react';

const SearchBar = ({ setSearchVal }: { setSearchVal: any }) => {
   const sRef = useRef<HTMLInputElement>(null);
   const [search, setSearch] = useState('');

   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
   };

   useEffect(() => {
      sRef.current?.focus();
   }, [sRef]);

   return (
      <input
         onBlur={() => setSearchVal(false)}
         type="text"
         name="search"
         ref={sRef}
         value={search}
         onChange={handleSearch}
         id=""
         className="relative px-2 w-full min-w-[200px] bg-gray-100 dark:bg-slate-900  border-b border-gray-500 outline-none font-poppins text-sm text-gray-600 dark:text-slate-100 py-1"
      />
   );
};

export default SearchBar;
