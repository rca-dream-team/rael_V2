import MainModal from '@/components/shared/MainModal';
import { PencilIcon } from '@heroicons/react/24/outline';
import { ActionIcon, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ImageUploadArea from './ImageUploadArea';
import { useState } from 'react';
import { updateProfilePicture } from '@/lib/actions';
import { useAuth } from '@/contexts/AuthProvider';
import { notifications } from '@mantine/notifications';

const UpdateProfilePic = () => {
   const { user, getProfile } = useAuth();
   const [opened, { open, close }] = useDisclosure();
   const [loading, setLoading] = useState(false);
   const [selectFile, setSelectFile] = useState<File | null>(null);

   const handleFilesSelected = (files: File[]) => {
      //console.log('filetype' + ':' + files);
      setSelectFile(files[0]);
   };

   const handleUpload = async () => {
      if (!selectFile || !user) return;
      setLoading(true);
      try {
         //console.log('---user---', user);
         const res = await updateProfilePicture(selectFile, { docId: user._id });
         //console.log('res', res);
         notifications.show({
            title: 'Profile Picture Updated',
            message: 'Profile Picture Updated Successfully',
            color: 'black',
            icon: <PencilIcon className="w-6 h-6" />,
         });
         getProfile();
         close();
      } catch (error: any) {
         //console.log('---errr----', error);
         notifications.show({
            title: 'Error',
            message: error.message ?? 'Profile Picture Update Failed',
            color: 'red',
            icon: <PencilIcon className="w-6 h-6" />,
         });
      }
      setLoading(false);
   };

   return (
      <>
         <div className=" absolute z-10 bottom-10 right-10">
            <ActionIcon onClick={open} radius={'100%'} className=" bg-gray-600 text-white hover:!bg-gray-700 p-2 w-11 h-11">
               <PencilIcon className="w-6" />
            </ActionIcon>
         </div>
         <MainModal
            title="Update Profile Picture"
            open={opened}
            onClose={close}
            size="xl"
            padding="lg"
            closeOnClickOutside={false}
         >
            <div className="flex flex-col gap-4 mt-4">
               <ImageUploadArea title="Upload Image here" onFilesSelected={handleFilesSelected} />
               <Button
                  onClick={handleUpload}
                  loading={loading}
                  disabled={loading}
                  className="bg-black text-white dark:bg-white dark:text-black self-center mt-6 "
               >
                  Update
               </Button>
            </div>
         </MainModal>
      </>
   );
};

export default UpdateProfilePic;
