import classNames from 'classnames';
import styles from './styles.module.scss';
import { forwardRef } from 'react';

type ChatItemProps = {
  className?: string;
  isRight?: boolean;
  header: string;
  message: string;
  dataIndex?: number;
};

const ChatItem = forwardRef<HTMLDivElement, ChatItemProps>(
  ({ className, isRight, header, message, dataIndex }, ref) => {
    return (
      <div
        data-index={dataIndex}
        ref={ref}
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
  },
);

ChatItem.displayName = 'ChatItem';

export default ChatItem;
