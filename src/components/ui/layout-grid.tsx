'use client';
import { Gallery } from '@/types/gallery';
import { cn } from '@/utils/cn';
import { putDataInCols } from '@/utils/funcs';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import GalleryViewer from './gallery-viewer';

type Card = {
   index: number;
   id: number | string;
   content: React.JSX.Element | React.ReactNode | string;
   className: string;
   thumbnail: string;
};

interface Props {
   cards: Card[];
   gallery: Gallery;
}

export const LayoutGrid = ({ cards, gallery }: Props) => {
   const [selected, setSelected] = useState<Card | null>(null);
   const [lastSelected, setLastSelected] = useState<Card | null>(null);
   const [cardGirdCols, setCardGridCols] = useState<Card[][]>([]);
   const [isFirstSelected, setIsFirstSelected] = useState(false); // to be changed in the future
   const [showViewer, setShowViewer] = useState({
      state: false,
      // gallery: [],
      active: 0,
   });

   const handleClick = (card: Card) => {
      setShowViewer({ state: true, active: card.index });
      // if (i === 0) setIsFirstSelected(true);
      // else setIsFirstSelected(false);
      // setLastSelected(selected);
      // setSelected(card);
   };

   const handleOutsideClick = () => {
      //console.log('outside click', selected);
      setLastSelected(selected);
      setSelected(null);
   };

   useEffect(() => {
      const cardGrid = putDataInCols(cards, 3);
      //console.log('cardGrid', cardGrid);
      setCardGridCols(cardGrid);
   }, [cards]);

   return (
      <>
         <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 mdgrid-cols-2  max-w-7xl mx-auto gap-4 ">
            {cardGirdCols.map((col, i) => {
               if (!col.length) return null;
               return (
                  <div key={i} className="flex flex-col w-full gap-3">
                     {col.map((card, i) => {
                        if (!card) return null;
                        return (
                           <div key={i} className={cn(' h-fit card tileCard cursor-pointer')}>
                              <motion.div
                                 onClick={() => handleClick(card)}
                                 className={cn(
                                    card.className,
                                    'relative overflow-hidden imgCont border dark:bg-black',
                                    selected?.id === card.id
                                       ? 'rounded-lg cursor-pointer border-gray-500 bg-gray-900/10 absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col'
                                       : lastSelected?.id === card.id
                                         ? 'z-40 bg-white rounded-xl h-full w-full'
                                         : 'bg-white rounded-xl h-full w-full',
                                 )}
                                 layout
                              >
                                 {selected?.id === card.id && <SelectedCard selected={selected} />}
                                 <BlurImage card={card} />
                              </motion.div>
                           </div>
                        );
                     })}
                     <motion.div
                        onClick={handleOutsideClick}
                        className={cn(
                           'fixed h-full w-full left-0 top-0 bg-black opacity-0 z-30',
                           selected?.id ? 'pointer-events-auto' : 'pointer-events-none',
                        )}
                        animate={{ opacity: selected?.id || isFirstSelected ? 0.3 : 0 }}
                     />
                  </div>
               );
            })}
         </div>
         {/* <Overlay zIndex={50} className=" top-0 left-0 w-full bottom-0 right-0" onClick={handleOutsideClick} /> */}
         {showViewer.state && (
            <div className=" z-50 w-full fixed top-0 bg-black/70 flex items-center justify-center h-full left-0">
               <GalleryViewer
                  gallery={gallery}
                  activeIndex={showViewer.active}
                  handleExit={() => setShowViewer({ state: false, active: 0 })}
               />
            </div>
         )}
      </>
   );
};

const BlurImage = ({ card }: { card: Card }) => {
   const [loaded, setLoaded] = useState(false);
   return (
      <Image
         src={card.thumbnail}
         height="500"
         width="500"
         onLoad={() => setLoaded(true)}
         className={cn('object-contain object-top  inset-0 h-full transition duration-200', loaded ? 'blur-none' : 'blur-md')}
         alt="thumbnail"
      />
   );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
   return (
      <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
         <motion.div
            initial={{
               opacity: 0,
            }}
            animate={
               {
                  // opacity: 0.6,
               }
            }
            className="absolute selected inset-0 h-full w-full bg-black opacity-60 z-10"
         />
         {selected && <BlurImage card={selected} />}
         <motion.div
            initial={{
               opacity: 0,
               y: 100,
            }}
            animate={{
               opacity: 1,
               y: 0,
            }}
            transition={{
               duration: 0.3,
               ease: 'easeInOut',
            }}
            className="relative px-8 pb-4 z-[70]"
         >
            {selected?.content}
         </motion.div>
      </div>
   );
};
