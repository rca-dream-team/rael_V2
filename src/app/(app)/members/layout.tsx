import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
   return <div className=" px-[5%] flex w-full flex-col items-center">{children}</div>;
};

export default Layout;
