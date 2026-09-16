/* eslint-disable react-hooks/exhaustive-deps */
import { MantineNumberSize, Modal, ModalProps, rem } from '@mantine/core';
import React from 'react';

interface ModalLayoutProps extends Omit<ModalProps, 'opened'> {
   children: React.ReactNode;
   open: boolean;
   fit?: boolean;
   size?: ModalProps['size'];
   closeOnClickOutside?: boolean;
   centered?: boolean;
   onClose: () => void;
   radius?: MantineNumberSize;
   padding?: ModalProps['padding'];
}

export default function ModalLayout(props: ModalLayoutProps) {
   const { children, open, size, centered = true, closeOnClickOutside = true, onClose, radius, padding, ...rest } = props;
   return (
      <Modal
         opened={open}
         size={size ?? 500}
         onClose={onClose}
         centered={centered}
         radius={radius ?? 10}
         closeOnClickOutside={closeOnClickOutside}
         withCloseButton={false}
         padding={padding ?? rem(25)}
         {...rest}
      >
         {children}
      </Modal>
   );
}
