import styles from './styles.module.scss';
import type React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

type InputProps = {
  onChange?: (value: string) => void;
  className?: string;
  contentEditable?: boolean;
  value?: string;
  placeholder?: string;
  autofocus?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = observer(
  ({ onChange, className, value, placeholder, onKeyDown, autofocus }) => {
    return (
      <input
        role="textbox"
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        autoFocus={autofocus}
        onKeyDown={onKeyDown}
        value={value}
        placeholder={placeholder}
        className={classNames(styles.container, className)}
      />
    );
  },
);

export default Input;
