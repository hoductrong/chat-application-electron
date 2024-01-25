import classNames from 'classnames';
import styles from './styles.module.scss';
import { useState } from 'react';
import type React from 'react';
import Input from '../Input';
import Button from '../Button';
import { observer } from 'mobx-react-lite';

type ChatInputProps = {
  className?: string;
  isDisabled?: boolean;
  onSubmit?: (message: string) => void;
  onInputChange?: (value: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = observer(
  ({ className, isDisabled, onSubmit }) => {
    const [message, setMessage] = useState<string>('');

    const onInputChange = (value: string) => {
      setMessage(value);
    };

    const onPress = () => {
      if (!message || isDisabled) return;
      onSubmit?.(message);
      setMessage('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onPress();
      }
    };

    return (
      <div className={classNames(styles.chatInputContainer, className)}>
        <Input
          value={message}
          className={styles.input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          autofocus={true}
          placeholder="Type your message here..."
        />
        <Button
          type="submit"
          isDisabled={isDisabled}
          className={styles.button}
          onClick={onPress}
        >
          Send
        </Button>
      </div>
    );
  },
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
