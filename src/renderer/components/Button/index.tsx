import classNames from 'classnames';
import styles from './styles.module.scss';
import type { PropsWithChildren } from 'react';
import type React from 'react';

type ButtonProps = {
  onClick?: () => void;
  className?: string;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  type,
  className,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={classNames(styles.container, className)}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
