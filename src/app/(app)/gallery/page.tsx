import RText from '@/components/constants/RighteousText';
import { GalleryIndex } from './_index';
import { Metadata } from 'next';
import { sanityClient } from '@/sanity/sanity.client';
import { fetchGalleryQuery } from '@/sanity/queries/gallery';

export const revalidate = 15;

export const metadata: Metadata = {
   title: 'RCA Gallery',
   description: 'View the gallery of the Rwanda Coding Academy',
};

const fetchGallery = async () => {
   return sanityClient.fetch(fetchGalleryQuery);
};

const GalleryPage = async () => {
   const gallery = await fetchGallery();

   return (
      <>
         <div className=" w-[80%] flex flex-col">
            <RText className="text-2xl">RCA Gallery</RText>
            <GalleryIndex gallery={gallery} />
         </div>
      </>
   );
};

export default GalleryPage;
