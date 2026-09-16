'use client';
import { sanityClient } from '@/sanity/sanity.client';
import { Button, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import csvtojson from 'csvtojson';
import React, { useState } from 'react';

const FileUpload = () => {
   const [file, setFile] = useState<Blob | null>(null);
   const [showModal, setShowModal] = useState(false);
   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFile(e.target?.files![0]);
   };

   const deleteAllStudents = () => {
      sanityClient
         .fetch('*[_type == "student"]{ _id }')
         .then((docs) => {
            // Build an array of transaction patches to delete each document
            const transactions = docs.map((doc: { _id: string }) => sanityClient.delete(doc._id));
            // Perform the delete transactions
            return Promise.all(transactions);
         })
         .then((res) => {
            //console.log('Deleted', res.length, 'documents');
            notifications.show({
               title: 'Delete successfully',
               message: `Deleted ${res.length} documents`,
               autoClose: 5000,
            });
         })
         .catch((err) => {
            //console.error('Delete failed:', err.message);
            notifications.show({
               title: 'Delete failed',
               message: err.message ?? 'Error deleting documents',
               autoClose: 5000,
            });
         })
         .finally(() => {
            setShowModal(false);
         });
   };

   const onFileUpload = async () => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
         const text = e.target?.result;
         const jsonObj = await csvtojson().fromString(text as string);
         //console.log('jsonObj', jsonObj);
         const newJsonObj = jsonObj.map((item) => {
            return {
               _type: 'student',
               names: item.names,
               email: item.email,
               bio: item.bio,
               socials: {
                  github: item.github,
                  linkedIn: item.linkedIn,
                  twitter: item.twitter,
                  facebook: item.facebook,
                  instagram: item.instagram,
                  portfolio: item.portfolio,
               },
               occupation: (item.occupation as string).split(','),
               leaderTitle: item.leaderTitle,
               pictureUrls: String(item.picture).split(','),
            };
         });
         // Send JSON to Sanity
         newJsonObj.forEach((item) => {
            sanityClient
               .create(item)
               .then((res) => console.log('res', res))
               .catch((err) => console.log('err', err));
         });
         // notifications.show({
         //    title: 'Upload successfully',
         //    message: `Uploaded ${newJsonObj.length} documents`,
         //    autoClose: 5000,
         // });
      };
      reader.readAsText(file);
   };

   return (
      <div className="flex flex-col">
         <div className="flex items-center">
            <input type="file" onChange={onFileChange} />
            <Button color="primary" className=" bg-blue-700 hover:bg-blue-950" onClick={onFileUpload}>
               Upload
            </Button>
         </div>
         <span>Want to delete all documents</span>
         <Button color="primary" className=" bg-red-700 hover:bg-red-950" onClick={() => setShowModal(true)}>
            DELETE
         </Button>
         <Modal title="Delete Students" opened={showModal} onClose={() => setShowModal(false)}>
            <h1> Are you sure want to delete all contents?</h1>
            <div className="flex w-full justify-between items-center">
               <Button color="primary" className=" bg-blue-700 hover:bg-blue-950" onClick={() => setShowModal(false)}>
                  NO
               </Button>
               <Button color="primary" className=" bg-red-700 hover:bg-red-950" onClick={deleteAllStudents}>
                  DELETE
               </Button>
            </div>
         </Modal>
      </div>
   );
};

export default FileUpload;
