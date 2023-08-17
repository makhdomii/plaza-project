import { ComponentProps } from 'react';
import classname from 'classnames';
import styles from './style.module.scss';

type ContainerType = {} & ComponentProps<'div'>;
export const Container = ({ children, ...rest }: ContainerType) => {
  return (
    <div {...rest} className={classname(rest.className, styles['container'])}>
      {children}
    </div>
  );
};
