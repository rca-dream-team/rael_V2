'use client';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/sanity.client';
import { Gallery, ImageAsset } from '@/types/gallery';
import { Text } from '@mantine/core';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

let interval: any;

// interface Card extends Gallery, IImage {}

type Props = { gallery: Gallery; offset?: number; scaleFactor?: number };

export const CardStack = ({ gallery, offset, scaleFactor }: Props) => {
   const CARD_OFFSET = offset || 10;
   const [cardOffset, setCardOffset] = useState<number>(0);
   const SCALE_FACTOR = scaleFactor || 0.06;
   const [cards, setCards] = useState<ImageAsset[]>([]);
   const [isFlipping, setIsFlipping] = useState(false);

   useEffect(() => {
      // startFlipping();

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const startFlipping = () => {
      setIsFlipping(true);
      setCardOffset(CARD_OFFSET);
      interval = setInterval(() => {
         setCards((prevCards: ImageAsset[]) => {
            const newArray = [...prevCards]; // create a copy of the array
            /* Uncomment first for the last to front */
            // newArray.unshift(newArray.pop()!); // move the last element to the front
            // move first element to the end
            const first = newArray.shift();
            if (first) {
               newArray.push(first);
            }
            // //console.log('newArray', newArray);
            return newArray;
         });
      }, 3000);
   };

   const stopFlipping = () => {
      setIsFlipping(false);
      setCardOffset(0);
      clearInterval(interval);
   };

   useEffect(() => {
      const cards = gallery.images?.slice(0, 3) || [];
      // cards.push(gallery as any); // add the gallery as a card, it may cause type error but it's fine for now
      // const newSet = new Set(cards.map((card) => JSON.stringify(card)));
      // const newCards = Array.from(newSet).map((card) => JSON.parse(card));
      // //console.log('cards', cards, gallery);
      setCards(cards);
   }, [gallery]);

   return (
      <div className="relative flex  aspect-[4/5] w-full">
         {cards.map((card, index) => {
            if (!card.asset && card._upload) {
               // means upload not completed
               // //console.log('cards', cards, gallery);
               return null;
            }
            // //console.log(`card ${index}`, card);
            const src = !isFlipping && index === 0 ? gallery.coverImage : card;
            // //console.log('src', src);
            const imageUrl = urlFor(src)?.url();
            return (
               <motion.div
                  key={card?.asset?._ref ?? index}
                  className="absolute h-full dark:bg-black duration-200 bg-whit w-full rounded-3xl shadow-xl border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
                  style={{
                     transformOrigin: 'top center',
                  }}
                  animate={{
                     top: index * -cardOffset,
                     scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
                     zIndex: cards.length - index, //  decrease z-index for the cards that are behind
                  }}
                  onMouseOver={() => startFlipping()}
                  onMouseOut={() => stopFlipping()}
               >
                  <Link
                     href={`/gallery/${gallery._id}`}
                     key={card?.asset?._ref}
                     className={' w-full  rounded-lg h-full border shadow-sm'}
                  >
                     <div className="relative overflow-hidden w-full h-full gallery-card rounded-lg">
                        <div className="bg-white dark:bg-black rounded-xl h-full flex imgCont w-full">
                           <BlurImage image={imageUrl} />
                        </div>
                        <div className=" absolute bottom-0 left-0 w-full bg-black/50 flex flex-col p-3">
                           <div>
                              <p className="font-bold text-lg text-white">{gallery.name}</p>
                              <p className="font-normal text-base text-white"></p>
                              {/* <Tooltip label={gallery.description} withArrow> */}
                              <Text lineClamp={4} className="font-normal text-base my-4 max-w-lg text-neutral-200">
                                 {gallery.description}
                              </Text>
                              {/* </Tooltip> */}
                           </div>
                        </div>
                     </div>
                  </Link>
               </motion.div>
            );
         })}
      </div>
   );
};

const BlurImage = ({ image }: { image: string }) => {
   const [loaded, setLoaded] = useState(false);
   return (
      <Image
         src={image}
         style={{ height: '100%' }}
         alt="gallery"
         // layout="responsive"
         // objectFit="cover"
         className={cn('object-cover flex !h-full w-full', loaded ? 'blur-none' : 'blur-md border-red-600')}
         onLoad={() => setLoaded(true)}
         width={800}
         height={600}
      />
   );
};
