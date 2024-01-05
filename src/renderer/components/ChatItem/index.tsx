import classNames from 'classnames';
import styles from './styles.module.scss';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { Message } from 'src/lib/types';

type ChatItemProps = {
  className?: string;
  isRight?: boolean;
  dataIndex?: number;
  item: Message;
};

const ChatItem = forwardRef<HTMLDivElement, ChatItemProps>(
  ({ className, isRight, dataIndex, item }, ref) => {
    const { senderName: header, message } = item;
    const [isHasQrCode, setIsHasQrCode] = useState<boolean>(false);
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const parseItem = async () => {
        if (!item.bankQrCode) return;

        if (cardRef.current) {
          cardRef.current.appendChild(item.bankQrCode);
          setIsHasQrCode(true);
        }
      };
      parseItem();
    }, [item]);

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
        <div ref={cardRef} className={styles.card}></div>
      </div>
    );
  },
);

ChatItem.displayName = 'ChatItem';

export default ChatItem;
