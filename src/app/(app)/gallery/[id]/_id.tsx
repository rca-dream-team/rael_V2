'use client';
import { LayoutGrid } from '@/components/ui/layout-grid';
import { urlFor } from '@/sanity/sanity.client';
import { Gallery } from '@/types/gallery';

interface Props {
   gallery: Gallery;
}

export function GalleryIdIndex({ gallery }: Props) {
   //console.log('gallery id', gallery);
   const galleryImages = gallery.images.filter((img) => {
      return img.asset && !img._upload;
   });
   const cards = galleryImages.map((g, i) => {
      const colSpan = i % 3 === 0 ? 'md:col-span-2' : 'col-span-1';
      return {
         id: i,
         index: i, // to be used in gallery viewer
         content: (
            <div>
               <p className="font-bold text-4xl text-white">{gallery.name}</p>
               <p className="font-normal text-base text-white"></p>
            </div>
         ),
         className: colSpan,
         thumbnail: urlFor(g).url(),
      };
   });

   const _gallery = {
      ...gallery,
      images: gallery?.images?.filter((im) => !im._upload),
   };
   //console.log('_gallery', _gallery);

   return (
      <div className=" py-11 w-full">
         <LayoutGrid cards={cards} gallery={_gallery} />
      </div>
   );
}
