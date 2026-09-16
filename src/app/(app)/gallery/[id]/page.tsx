import { fetchGalleryById } from '@/sanity/queries/gallery';
import { urlFor } from '@/sanity/sanity.client';
import { PageProps } from '@/types';
import { Gallery } from '@/types/gallery';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BiArrowBack } from 'react-icons/bi';
import { GalleryIdIndex } from './_id';

export const revalidate = 15;

export async function generateMetadata(props: PageProps): Promise<Metadata> {
   if (!props.params?.id) return { title: 'Gallery' };
   const data: Gallery = await fetchGalleryById(props.params?.id);
   // //console.log('data', data);
   if (!data) return notFound();
   const galleryImages = data.images.filter((img) => {
      return img.asset && !img._upload;
   });
   return {
      title: data?.name,
      description: data?.description,
      openGraph: {
         images: [
            {
               url: urlFor(data.coverImage).url(),
               width: 800,
               height: 600,
               alt: data.name,
            },
            ...galleryImages.map((image, i) => ({
               url: urlFor(image)?.url(),
               width: 800,
               height: 600,
               alt: `image ${i} of ${data.name}`,
            })),
         ],
      },
   } as Metadata;
}

const GalleryIdPage = async (props: PageProps) => {
   if (!props.params?.id) return notFound();
   const gallery: Gallery = await fetchGalleryById(props.params?.id);
   if (!gallery) return notFound();

   return (
      <div className=" w-full flex flex-col">
         <Link href="/gallery" className=" font-semibold mb-6 flex items-center gap-2 text-lg">
            <BiArrowBack />
            Back to all gallery
         </Link>
         <h1 className=" capitalize text-center text-lg">{gallery.name}</h1>
         <p className=" text-center text-sm font-poppins dark:text-gray-300">{gallery.description}</p>
         <GalleryIdIndex gallery={gallery} />
      </div>
   );
};

export default GalleryIdPage;
