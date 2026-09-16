//input component
import React from 'react';
import { useState, useEffect } from 'react';
import { SchemaType } from 'sanity';
import { sanityClient } from '../sanity.client';

interface Props {
   schemaType: SchemaType;
   renderDefault: (props: any) => React.JSX.Element;
}

export const AsyncListInput = (props: Props) => {
   const [listItems, setListItems] = useState([]);
   const { schemaType, renderDefault } = props;
   const { options } = schemaType;
   const { query, formatResponse } = options;

   useEffect(() => {
      const getListItems = async () => {
         const res = await sanityClient.fetch(query);
         const formattedResponse = formatResponse(res);
         setListItems(formattedResponse);
      };

      getListItems();
   }, [formatResponse, query]);

   return renderDefault({
      ...props,
      schemaType: { ...schemaType, options: { ...options, list: listItems } },
   });
};
