import React, { ReactNode } from 'react';

const ProfileLayout = ({ children }: { children: ReactNode }) => {
   return <div className=" px-[5%] w-full flex flex-col items-center">{children}</div>;
};

export default ProfileLayout;
