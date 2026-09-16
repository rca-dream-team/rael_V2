'use client';
import { CardStack } from '@/components/ui/card-stack';
import { fetchGallery } from '@/sanity/queries/gallery';
import { urlFor } from '@/sanity/sanity.client';
import { Gallery } from '@/types/gallery';
import { useEffect } from 'react';

interface Props {
   gallery: Gallery[];
}

export function GalleryIndex({ gallery }: Props) {
   //console.log('gallery', gallery);

   const cards = gallery.map((g, i) => {
      const colSpan = i % 3 === 0 ? 'md:col-span-2' : 'col-span-1';
      const thumbnail = g.coverImage ? urlFor(g.coverImage).url() : g?.images?.[0] ? urlFor(g?.images?.[0]).url() : null;
      return {
         id: g._id,
         content: (
            <div>
               <p className="font-bold text-lg text-white">{g.name}</p>
               <p className="font-normal text-base text-white"></p>
               <p className="font-normal text-base my-4 max-w-lg text-neutral-200">{g.description}</p>
            </div>
         ),
         className: colSpan,
         thumbnail,
         images: g.images,
      };
   });

   useEffect(() => {
      fetchGallery();
   }, []);

   return (
      <div className=" py-11 flex flex-col w-full">
         <div className="w-full grid grid-cols-1 h-full lg:grid-cols-3 md:grid-cols-2 max-w-7xl mx-auto gap-4 gap-y-10 ">
            {cards.map((card) => {
               const g = gallery.find((g) => g._id === card.id);
               if (!g) return null;
               return <CardStack key={card.id} gallery={g} />;
            })}
         </div>
      </div>
   );
}
