'use client';
import { useApp } from '@/contexts/AppProvider';
import { Timeline } from '@/types/timeline.type';
import dayjs from 'dayjs';
import React, { FC, useEffect } from 'react';
import { Chrono } from 'react-chrono';
import { TimelineItemModel } from 'react-chrono/dist/models/TimelineItemModel';

interface TimelineProps {
   data: Timeline[];
}

const ChronoTimeline: FC<TimelineProps> = ({ data }) => {
   const { isDarkTheme } = useApp();
   const [loading, setLoading] = React.useState(true);
   const [timeLineData, setTimeLineData] = React.useState<TimelineItemModel[]>([]);

   function mapTimelineDataToModel(data: Timeline[]): TimelineItemModel[] {
      return data.map((item) => ({
         title: dayjs(item.time).format('MMM D YYYY'),
         cardTitle: item.title,
         url: item.url,
         cardSubtitle: item.title,
         cardDetailedText: item.description,
         // imageUrl: item.image.asset.url,
         media: {
            type: 'IMAGE',
            source: {
               url: item.image.asset.url,
            },
         },
      }));
   }

   useEffect(() => {
      setLoading(true);
      const timeout = setTimeout(() => {
         setLoading(false);
      }, 1000);

      return () => {
         setLoading(false);
         clearTimeout(timeout);
      };
   }, [isDarkTheme]);

   useEffect(() => {
      const newTimeLine = mapTimelineDataToModel(data);
      setTimeLineData(newTimeLine);
   }, [data]);
   return (
      <div className="my-timeline" style={{ width: '100%', height: '85vh' }}>
         {/* {createPortal( */}
         {!loading ? (
            <Chrono
               slideShow
               items={timeLineData}
               mode="VERTICAL_ALTERNATING"
               darkMode={isDarkTheme}
               theme={{
                  primary: isDarkTheme ? 'white' : 'black',
                  secondary: isDarkTheme ? 'white' : 'black',
                  cardBgColor: isDarkTheme ? 'black' : 'white',
                  titleColor: isDarkTheme ? 'white' : 'black',
                  titleColorActive: isDarkTheme ? 'black' : 'white',
                  cardTitleColor: isDarkTheme ? 'white' : 'black',
                  cardSubtitleColor: isDarkTheme ? 'white' : 'black',
                  cardDetailsColor: isDarkTheme ? 'white' : 'black',
                  // toolbarTextColor: isDarkTheme ? 'black' : 'white',
                  toolbarBgColor: isDarkTheme ? 'black' : 'white',
                  iconBackgroundColor: 'blue',
               }}
               classNames={{
                  cardTitle: 'hidden',
                  cardSubTitle: 'timeDetail !px-5 !text-lg',
                  cardText: 'cardText',
                  controls: isDarkTheme && 'dark-controls', // check app.css file for more
               }}
               buttonTexts={{
                  first: 'Jump to First',
                  last: 'Jump to Last',
                  next: 'Next',
                  previous: 'Previous',
               }}
               mediaSettings={{ align: 'right', fit: 'contain' }}

               // className="hidden"
            >
               {/* <div className="chrono-icons">
                  <img src="image1.svg" alt="image1" />
                  <img src="image2.svg" alt="image2" />
               </div> */}
            </Chrono>
         ) : (
            <div className=" flex items-center dark:text-white justify-center h-full w-full">
               <h1 className="text-xl font-bold">Please Wait...</h1>
            </div>
         )}
         ,
         {/* document.querySelector("html") as Element
      )} */}
      </div>
   );
};

export default ChronoTimeline;
