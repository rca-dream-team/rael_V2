import React from 'react';
import ChronoTimeline from './chrono-timeline';
import { sanityClient } from '@/sanity/sanity.client';
import { getAllTimeline } from '@/sanity/queries/timeline.query';
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'RAEL | Timeline',
   description: 'All you need to know about RCA and the RCA community during the years',
   openGraph: {
      type: 'website',
      locale: 'en_IE',
      url: 'http://194.163.167.131:2024/',
      siteName: 'RAEL',
      description: 'All you need to know about RCA and the RCA community during the years',
   },
};

export const revalidate = 15;

const getTimelineData = async () => {
   const data = await sanityClient.fetch(getAllTimeline);
   return data;
};

const TimelinePage = async () => {
   const timeline = await getTimelineData();

   return (
      <div className="flex flex-col w-full px-[5%] items-center">
         {/* <MantineTimeline /> */}
         {<ChronoTimeline data={timeline} />}
      </div>
   );
};

export default TimelinePage;
