import React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
   noDark?: boolean;
}
/**
 * @name Text
 * @desc a simple text component
 * @param {TextProps} props
 * @returns
 * @example const example = () => <Text>Example</Text>
 */
const Text = (props: TextProps) => {
   const noDark = props.noDark;
   let newProps = { ...props };
   delete newProps.noDark;
   return (
      <span {...newProps} className={`${newProps.className} ${noDark ? '' : 'dark:text-white'}`}>
         {newProps.children}
      </span>
   );
};

export default Text;
