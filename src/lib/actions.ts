// 'use server';
import { v4 as uuidv4 } from 'uuid';
import { sanityClient } from '@/sanity/sanity.client';
import { ImageAsset } from '@/types/gallery';

interface Opts {
   //    docType: string;
   docId: string;
   handleProgress?: (progress: number) => void;
}

export const updateProfilePicture = async (file: File, opts: Opts) => {
   //console.log('file', file);
   const { docId } = opts;
   const asset = await sanityClient.assets.upload('image', file, { filename: file.name });
   const student = await sanityClient.fetch('*[_type == "student" && _id == $docId][0]', { docId });
   if (!student) throw new Error('Student not found or Your profile must be approved first.');
   const doc = await sanityClient
      .patch(docId)
      .set({
         picture: {
            _type: 'image',
            asset: {
               _type: 'reference',
               _ref: asset._id,
            },
         },
      })
      .commit();
   return doc;
};

export const addStudentImages = async (files: File[], opts: Opts) => {
   const { docId, handleProgress } = opts;
   const assets = await Promise.all(
      files.map(async (file, i) => {
         const doc = await sanityClient.assets.upload('image', file, { filename: file.name });
         handleProgress?.(i + 1);
         return doc;
      }),
   );
   const student = await sanityClient.fetch('*[_type == "student" && _id == $docId][0]', { docId });
   if (!student) throw new Error('Student not found');
   const images = student.images || [];
   const newIAdds = assets.map((asset) => ({
      _type: 'image',
      _key: uuidv4(),
      asset: {
         _type: 'reference',
         _ref: asset._id,
      },
   }));
   //console.log('newIAdds', newIAdds);
   const newImages: ImageAsset[] = images.concat(newIAdds);
   const doc = await sanityClient
      .patch(docId)
      .set({
         images: newImages.map((image) => ({
            _type: 'image',
            _key: image._key,
            asset: {
               _type: 'reference',
               _ref: image.asset._ref,
            },
         })),
      })
      .commit();
   return doc;
};

export const removeImageFromStudent = async (opts: Opts, imageRef: string) => {
   const { docId } = opts;
   if (!docId || !imageRef) throw new Error('Invalid parameters. Please provide docId and imageRef.');
   const student = await sanityClient.fetch('*[_type == "student" && _id == $docId][0]', { docId });
   if (!student) throw new Error('Student not found');
   const images = (student.images || []) as ImageAsset[];
   const newImages = images.filter((image) => image.asset._ref !== imageRef);
   const doc = await sanityClient
      .patch(docId)
      .set({
         images: newImages.map((image) => ({
            _type: 'image',
            _key: image._key,
            asset: {
               _type: 'reference',
               _ref: image.asset._ref,
            },
         })),
      })
      .commit();
   // remove asset
   await sanityClient.delete(imageRef);
   return doc;
};
