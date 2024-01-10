import classNames from 'classnames';
import styles from './styles.module.scss';
import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import type { Message } from 'src/lib/types';

type ChatItemProps = {
  className?: string;
  isRight?: boolean;
  dataIndex?: number;
  item: Message;
  parseQrCode: (
    message: Message,
    options?: {
      signal: AbortSignal;
    },
  ) => Promise<void>;
};

const ChatItem = forwardRef<HTMLDivElement, ChatItemProps>(
  ({ className, isRight, dataIndex, item, parseQrCode }, ref) => {
    const { senderName: header, message } = item;
    const [, setIsHasQrCode] = useState<boolean>(false);
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const abortController = new AbortController();
      const parseItem = async () => {
        const signal = abortController.signal;
        await parseQrCode(item, {
          signal,
        });
        if (!item.bankInfo) return;

        if (cardRef.current) {
          cardRef.current.appendChild(item.bankInfo.svg);
          setIsHasQrCode(true);
        }
      };
      parseItem();

      return () => {
        abortController.abort();
      };
    }, [item, parseQrCode]);

    return (
      <div
        data-index={dataIndex}
        ref={ref}
        className={classNames(
          styles.container,
          className,
          isRight && styles.alignEnd,
        )}
      >
        <div
          className={classNames(
            styles.contentWrapper,
            isRight && styles.justifyEnd,
          )}
        >
          {isRight && <div className={styles.dummy} />}
          <div className={classNames(styles.content, isRight && styles.bgBlue)}>
            <div className={styles.header}>
              <div className={styles.name}>{header}</div>
            </div>
            <div className={styles.message}>{message}</div>
          </div>
          {!isRight && <div className={styles.dummy} />}
        </div>
        <div
          className={classNames(
            styles.cardContainer,
            !item?.bankInfo?.svg && styles.hide,
            isRight && styles.justifyEnd,
          )}
        >
          {item.bankInfo && (
            <div className={styles.cardHeader}>
              {item.bankInfo.bank.bankName}
            </div>
          )}
          <div ref={cardRef} className={styles.card}></div>
        </div>
      </div>
    );
  },
);

ChatItem.displayName = 'ChatItem';

export default memo(ChatItem);
