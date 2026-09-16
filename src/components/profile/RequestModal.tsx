import React, { FC } from 'react';
import MainModal from '../shared/MainModal';
import { Button } from '@mantine/core';

interface RequestModalProps {
   onClose: () => void;
   onSure: () => void;
   loading?: boolean;
}

const RequestModal: FC<RequestModalProps> = ({ onClose, onSure, loading }) => {
   return (
      <MainModal title="Request Profile" open={true} onClose={onClose}>
         <div className="flex w-full flex-col gap-3">
            <p>Are you sure you want to update or request a profile?</p>
            <div className=" w-full justify-between items-center flex">
               <Button className=" dark:text-white dark:border-white" disabled={loading} onClick={onClose} variant="outline">
                  Cancel
               </Button>
               <Button
                  className=" dark:bg-white bg-black dark:text-black"
                  onClick={onSure}
                  variant="filled"
                  disabled={loading}
                  loading={loading}
               >
                  Request
               </Button>
            </div>
         </div>
      </MainModal>
   );
};

export default RequestModal;
