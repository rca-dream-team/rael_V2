import { Button, ButtonProps } from '@mantine/core';

interface Props extends ButtonProps {
   onClick: () => void;
}

export function ActionButton(props: Props) {
   const { children, ...rest } = props;

   return <Button {...rest}>{children}</Button>;
}
