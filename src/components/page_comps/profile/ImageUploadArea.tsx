/* eslint-disable @next/next/no-img-element */
'use client';
import { cn } from '@/utils/cn';
import React, { FC, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoClose } from 'react-icons/io5';

const ImageUploadArea: FC<{
   onFilesSelected: (files: File[]) => void;
   title: string;
   multiple?: boolean;
}> = ({ onFilesSelected, title, multiple }) => {
   const [selectedImages, setSelectedImages] = useState<string[]>([]);
   const [files, setFiles] = useState<File[]>([]);

   const onDrop = (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
      setFiles(acceptedFiles);
      // const file = acceptedFiles[0];
      acceptedFiles.forEach((file) => {
         if (file) {
            const reader = new FileReader();
            reader.onload = () => {
               setSelectedImages(!multiple ? [reader.result as string] : (prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
         }
      });
   };

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: ['.png', '.PNG', '.jpg', '.JPG', '.jpeg', '.JPEG'],
      multiple,
   });

   const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;

      if (items) {
         for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
               const blob = items[i].getAsFile();
               const randomName = Math.random().toString(36).substring(7) + Date.now().toString();
               const file = new File([blob as Blob], `${randomName}`, { lastModified: Date.now() });

               const reader = new FileReader();
               reader.onload = () => {
                  setSelectedImages(!multiple ? [reader.result as string] : (prev) => [...prev, reader.result as string]);
               };
               if (blob) reader.readAsDataURL(blob);
               onFilesSelected(multiple ? [...files, file] : [file]);
               setFiles(multiple ? [...files, file] : [file]);
               break;
            }
         }
      }
   };

   const removeImage = (index: number) => {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
      onFilesSelected(files.filter((_, i) => i !== index));
   };

   return (
      <div className=" w-full flex flex-col gap-2">
         {selectedImages.length > 0 && (
            <div className={cn(multiple ? 'grid lg:grid-cols-3 sm:grid-cols-2 gap-2' : 'flex flex-wrap', 'w-full')}>
               {selectedImages.map((selectedImage, i) => (
                  <div
                     key={i}
                     className="bg-[rgba(67,67,67,0.03)] relative w-full aspect-square rounded-md border-[2px] border-[rgba(67,67,67,0.09)] flex flex-col gap-5 justify-center items-center"
                  >
                     <img src={selectedImage as string} alt="Selected" className="w-full h-full object-cover rounded-lg" />
                     <button
                        onClick={() => removeImage(selectedImages.indexOf(selectedImage))}
                        className="absolute top-2 right-2 bg-white dark:bg-[#060911] rounded-full p-1"
                     >
                        <IoClose className="w-6 h-6 text-black dark:text-white" />
                     </button>
                  </div>
               ))}
            </div>
         )}
         <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active bg-[rgba(42,10,82,0.1)]' : ''}`}
            onPaste={handlePaste}
         >
            <input {...getInputProps()} />
            <div className={cn(selectedImages.length > 0 ? ' h-fit' : 'h-[300px]')}>
               {isDragActive ? (
                  <div className="bg-[rgba(67,67,67,0.03)] rounded-md h-full border-[2px] border-gray-400 flex flex-col gap-5 justify-center items-center p-2 ">
                     <p className="text-[rgba(0,0,0,0.1)] dark:text-white  text-[28px] font-semibold">
                        Select or Drop/Copy the file here
                     </p>
                  </div>
               ) : (
                  <div className="bg-[rgba(67,67,67,0.03)] rounded-md border-dashed h-full border-[2px] border-gray-400 flex flex-col gap-5 justify-center  items-center p-2">
                     <p className="text-[rgba(0,0,0,0.1)] text-center dark:text-gray-400 text-[28px] font-semibold">
                        {multiple ? 'Drag & Drop or Select/Copy Multiple' : 'Drag & Drop or Select/Copy'}
                     </p>
                     <p className="text-[rgba(73,73,74,0.78)] text-sm dark:text-gray-400  font-medium">{title}</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default ImageUploadArea;
