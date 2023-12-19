import classNames from 'classnames';
import styles from './styles.module.scss';
import type React from 'react';

type ChatItemProps = {
  className?: string;
  isRight?: boolean;
  header: string;
  message: string;
};

const ChatItem: React.FC<ChatItemProps> = ({
  className,
  isRight,
  header,
  message,
}) => {
  return (
    <div
      className={classNames(
        styles.container,
        className,
        isRight && styles.justifyEnd,
      )}
    >
      <div className={styles.contentWrapper}>
        {isRight && <div className={styles.dummy} />}
        <div className={classNames(styles.content, isRight && styles.bgBlue)}>
          <div className={styles.header}>
            <div className={styles.name}>{header}</div>
          </div>
          <div className={styles.message}>{message}</div>
        </div>
        {!isRight && <div className={styles.dummy} />}
      </div>
    </div>
  );
};

export default ChatItem;
