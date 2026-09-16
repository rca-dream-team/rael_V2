import { urlFor } from '@/sanity/sanity.client';
import { Gallery } from '@/types/gallery';
import { ArrowLeftIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { FastAverageColor } from 'fast-average-color';
import React, { FC, useEffect, useState } from 'react';
import BlurImage from './brul-image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from './carousel';

interface Props {
   gallery: Gallery;
   activeIndex: number;
   handleExit?: () => void;
}

const GalleryViewer: FC<Props> = ({ gallery, activeIndex, handleExit }) => {
   const [active, setActive] = useState<number>(activeIndex);
   const [zoom, setZoom] = useState<number>(1);
   // const idle = useIdle(3000);

   //console.log('active', active);

   useEffect(() => {
      const keyHandler = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            handleExit?.();
         }
      };
      window.addEventListener('keydown', keyHandler);
      return () => {
         window.removeEventListener('keydown', keyHandler);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <div className=" w-full h-full overflow-hidden items-center justify-center flex">
         <div className="flex bg-gradient-to-b top-0 from-black/70 to-transparent w-full absolute z-50 items-center justify-between">
            <button onClick={handleExit} className="text-white border rounded-full p-2 border-black/20 hover:bg-white/10">
               <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div className="text-white p-4">
               {active + 1}/{gallery.images.length}
            </div>
            <div className="flex items-center gap-1">
               <button
                  className="text-white border rounded-full p-2 border-black/20 hover:bg-white/10"
                  onClick={() => setZoom((prev) => prev + 0.1)}
               >
                  <MagnifyingGlassPlusIcon className="w-4 h-4" />
               </button>
               <button
                  className="text-white border rounded-full p-2 border-black/20 hover:bg-white/10"
                  onClick={() => setZoom((prev) => prev - 0.1)}
               >
                  <MagnifyingGlassMinusIcon className="w-4 h-4" />
               </button>
            </div>
         </div>
         <Carousel
            // plugins={[plugin.current]}
            className="w-full p-11 h-full relative"
            opts={{
               startIndex: active,
            }}
            // onMouseEnter={plugin.current.stop}
            // onMouseLeave={plugin.current.reset}
         >
            <CarouselEventsHandler setZoom={setZoom} setActive={setActive} active={active} gallery={gallery} />
            <CarouselContent className=" h-full">
               {gallery.images.map((image, index) => (
                  <Item key={index} image={image} index={index} zoom={zoom} />
               ))}
            </CarouselContent>
         </Carousel>
      </div>
   );
};

const Item = ({ image, index, zoom }: { image: Gallery['images'][0]; index: number; zoom: number }) => {
   const [color, setColor] = useState<string>('#000000');
   const getColor = async () => {
      //console.log('getting color');
      const src = urlFor(image).url();
      const fac = new FastAverageColor();
      const color = await fac.getColorAsync(src);
      //console.log('color', color);
      setColor(color.hex);
   };

   useEffect(() => {
      getColor();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <CarouselItem key={index} className="relative overflow-auto">
         <div
            className=" absolute shadow-2xl z-0 top-0 left-0 blur-md w-full h-full opacity-40"
            style={{ backgroundColor: color }}
         ></div>
         <div
            className="p-1 h-full relative z-40  flex items-center object-center justify-center"
            style={{ transformOrigin: 'center', width: `${100 * zoom}%`, height: `${100 * zoom}%` }}
         >
            <BlurImage className=" object-center w-full" src={urlFor(image).url()} alt={'image.title'} />
            {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
         </div>
      </CarouselItem>
   );
};

type EvProps = {
   setActive: React.Dispatch<React.SetStateAction<number>>;
   active: number;
   setZoom: React.Dispatch<React.SetStateAction<number>>;
   gallery: Gallery;
};

const CarouselEventsHandler = ({ setActive, active, gallery, setZoom }: EvProps) => {
   const { api } = useCarousel();

   const handlePrev = () => {
      if (active === 0) return;
      setZoom?.(1);
      setActive((prev) => (prev - 1 + gallery.images.length) % gallery.images.length);
      api?.scrollPrev();
   };

   const handleNext = () => {
      if (active === gallery.images.length - 1) return;
      setZoom?.(1);
      setActive((prev) => (prev + 1) % gallery.images.length);
      api?.scrollNext();
   };
   const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
         if (event.key === 'ArrowLeft') {
            event.preventDefault();
            handlePrev();
         } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            handleNext();
         }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [api],
   );

   React.useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [handleKeyDown]);
   return (
      <>
         <CarouselPrevious onClick={handlePrev} className=" absolute left-0" />
         <CarouselNext onClick={handleNext} className=" absolute right-0" />
      </>
   );
};

export default GalleryViewer;
