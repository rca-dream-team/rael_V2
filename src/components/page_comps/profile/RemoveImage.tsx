import MainModal from '@/components/shared/MainModal';
import { useAuth } from '@/contexts/AuthProvider';
import { removeImageFromStudent } from '@/lib/actions';
import { urlFor } from '@/sanity/sanity.client';
import { ImageAsset } from '@/types/gallery';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Image from 'next/image';
import React from 'react';
import { IoCheckmarkCircle, IoClose } from 'react-icons/io5';

interface RemoveImageProps {
   image: ImageAsset;
}

const RemoveImage = ({ image }: RemoveImageProps) => {
   const { getProfile, user } = useAuth();
   const [isOpen, { open, close }] = useDisclosure();
   const [loading, setLoading] = React.useState(false);

   const removeImage = async () => {
      setLoading(true);
      if (!user) return;
      try {
         await removeImageFromStudent({ docId: user?._id }, image?.asset?._ref);
         notifications.show({
            title: 'Image Removed',
            message: 'Image removed successfully',
            color: 'black',
            icon: <IoCheckmarkCircle className="w-6 h-6" />,
         });
         getProfile();
         close();
      } catch (error: any) {
         console.error('Error removing image', error);
         notifications.show({
            title: 'Error',
            message: error.message ?? 'Failed to remove image',
            color: 'red',
            icon: <IoClose className="w-6 h-6" />,
         });
      }
      setLoading(false);
   };

   return (
      <>
         <button onClick={open} className="absolute top-2 right-2 bg-white dark:bg-[#060911] rounded-full p-1">
            <IoClose className="w-6 h-6 text-black dark:text-white" />
         </button>
         <MainModal open={isOpen} onClose={close} title="Remove Image">
            <p className=" text-center">Are you sure you want to remove this image?</p>
            <p className=" text-center">This action cannot be undone</p>
            <Image
               src={urlFor(image).url()}
               alt="Alt"
               className="w-full mx-auto max-w-[16em] rounded-xl overflow-hidden"
               width={300}
               height={300}
               quality={100}
            />
            <div className="flex justify-center gap-4 mt-2">
               <Button
                  disabled={loading}
                  onClick={close}
                  className="bg-black text-white dark:bg-white dark:text-black self-center mt-6 "
               >
                  Cancel
               </Button>
               <Button
                  onClick={removeImage}
                  loading={loading}
                  disabled={loading}
                  className="bg-red-500 text-white dark:bg-red-500 hover:bg-red-700 dark:text-white self-center mt-6 "
               >
                  Remove
               </Button>
            </div>
         </MainModal>
      </>
   );
};

export default RemoveImage;
