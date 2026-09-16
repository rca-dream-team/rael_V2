import { usePathname } from 'next/navigation';
import React from 'react';
import { links } from '.';
import Link from 'next/link';

const NewNavbar = () => {
   const [path, setPath] = React.useState('');
   const pathname = usePathname();

   React.useEffect(() => {
      setPath(pathname ?? '');
   }, [pathname]);
   return (
      <div className="flex flex-col w-full overflow-x-auto sticky top-0 sm:items-center">
         <div className=" bg-white dark:bg-black dark:border-slate-900/90 overflow-hidden flex items-center max-w-[800px] w-fit">
            {links.map((link) => {
               return (
                  <Link
                     // @ts-ignore
                     href={link.href[0]}
                     key={link.name}
                     className={`2sm:py-3 cursor-pointer border-b-2 dark:bg-black dark:text-white bg-white text-black font-righteous  py-2 whitespace-nowrap px-3 2sm:text-base text-sm  2sm:px-5 ${
                        link.href.includes(path) ? ' border-black dark:border-white' : ' border-transparent'
                     }`}
                  >
                     {link.name}
                  </Link>
               );
            })}
         </div>
      </div>
   );
};

export default NewNavbar;
