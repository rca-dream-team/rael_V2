import React from 'react';
import Text, { TextProps } from './Text';

/**
 * @description RText is a component that uses the Righteous font
 * @param {TextProps} props
 * @returns {JSX.Element}
 */
const RText = (props: TextProps): React.JSX.Element => {
   return (
      <Text {...props} className={`font-righteous ${props.className}`}>
         {props.children}
      </Text>
   );
};

export default RText;
