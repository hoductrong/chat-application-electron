import styles from './styles.module.scss';
import type React from 'react';
import classNames from 'classnames';

type InputProps = {
  onChange?: (value: string) => void;
  className?: string;
  contentEditable?: boolean;
  value?: string;
  placeholder?: string;
};

const Input: React.FC<InputProps> = ({
  onChange,
  className,
  value,
  placeholder,
}) => {
  return (
    <input
      role="textbox"
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      value={value}
      placeholder={placeholder}
      className={classNames(styles.container, className)}
    />
  );
};

export default Input;
