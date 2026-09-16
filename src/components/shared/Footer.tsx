import React from 'react';
import PText from '../constants/PoppinText';
import { FaHeart } from 'react-icons/fa';

interface Props {
   hasDark?: boolean;
}

const Footer = ({ hasDark }: Props) => {
   return (
      <div
         className={`border-t-2 mt-auto bg-white ${hasDark && 'dark:bg-black'} flex items-center justify-center py-3 border-stone-100 dark:border-slate-50/10 w-full z-[51]`}
      >
         <PText noDark className="flex items-center gap-2">
            Made with <FaHeart className=" text-red-700" />
            by <span>RCA DevTeam</span>
         </PText>
      </div>
   );
};

export default Footer;
