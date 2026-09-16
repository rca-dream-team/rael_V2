import React from 'react';
import { RxCross2 } from 'react-icons/rx';
import { ActionIcon, MantineNumberSize, ModalBaseProps } from '@mantine/core';
import ModalLayout from './ModalLayout';

export interface MainModalProps {
   open: boolean;
   onClose: () => void;
   title?: string;
   description?: string;
   children?: React.ReactNode;
   size?: ModalBaseProps['size'];
   closeOnClickOutside?: boolean;
   radius?: MantineNumberSize;
   padding?: ModalBaseProps['padding'];
}

const MainModal = (props: MainModalProps) => {
   const { open, onClose, description, title, children, ...rest } = props;
   return (
      <ModalLayout keepMounted={false} open={open} onClose={onClose} {...rest}>
         <div className={'flex bg-inherit sticky top-0 justify-between w-full'}>
            <div className={'flex flex-col gap-0'}>
               <h1 className={'text-xl font-bold'}>{title}</h1>
               <p className={'text-color-a2 text-sm font-semibold'}>{description}</p>
            </div>
            <ActionIcon variant="transparent" onClick={onClose}>
               <RxCross2 className="w-6 h-6 text-color-a2 cursor-pointer" />
            </ActionIcon>
         </div>
         {children}
      </ModalLayout>
   );
};

export default MainModal;
