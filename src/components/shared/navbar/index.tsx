'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export const links = [
   {
      name: 'RCA Daily',
      href: ['/'],
   },
   {
      name: 'Timeline',
      href: ['/timeline'],
   },
   {
      name: 'Rca Family',
      href: ['/members'],
   },
   {
      name: 'Gallery',
      href: ['/gallery'],
   },
];

const NavBar = () => {
   const [path, setPath] = React.useState('');
   const pathname = usePathname();

   React.useEffect(() => {
      setPath(pathname ?? '');
   }, [pathname]);
   return (
      <div className="flex flex-col w-full overflow-x-auto sticky top-0 sm:items-center">
         <div className=" border-2 bg-white dark:bg-black dark:border-slate-900/90 overflow-hidden flex items-center rounded-[2em] max-w-[800px] w-fit">
            {links.map((link) => {
               // const
               return (
                  <Link
                     // @ts-ignore
                     href={link.href[0]}
                     key={link.name}
                     className={`2sm:py-3 cursor-pointer font-righteous  py-2 whitespace-nowrap px-3 2sm:text-base text-sm rounded-[3em] 2sm:px-5 ${
                        link.href.includes(path) || path.includes(link.href[0])
                           ? 'dark:bg-white dark:text-black bg-black text-white'
                           : 'dark:bg-black dark:text-white bg-white text-black'
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

export default NavBar;
