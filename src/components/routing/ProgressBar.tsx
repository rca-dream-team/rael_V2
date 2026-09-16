'use client';
import { Progress } from '@mantine/core';
import React, { useEffect, useState } from 'react';

const ProgressBar = () => {
   const [value, setValue] = useState(0);

   React.useEffect(() => {
      const interval = setInterval(() => {
         setValue((currentValue) => (currentValue >= 98 ? 98 : currentValue + 1));
      }, 30);

      return () => clearInterval(interval);
   }, []);

   return <Progress className=" absolute top-0 left-0" value={value} variant="indeterminate" h={3} color={'black'} w={'100%'} />;
};

export default ProgressBar;
