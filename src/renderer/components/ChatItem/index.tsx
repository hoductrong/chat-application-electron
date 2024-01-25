import classNames from 'classnames';
import styles from './styles.module.scss';
import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import type { Message } from 'src/lib/types';
import { buildSrcUrl, cardBgMap } from './utils';
import { banksObject } from 'src/lib/bankqr/constants';

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
    const cardRef = useRef<HTMLImageElement | null>(null);
    const [img, setImg] = useState<string | undefined>(
      buildSrcUrl(item.bankInfo?.qrData),
    );

    useEffect(() => {
      const abortController = new AbortController();
      const parseItem = async () => {
        if (item.bankInfo?.qrData) {
          return;
        }

        const signal = abortController.signal;
        await parseQrCode(item, {
          signal,
        });
        if (!item.bankInfo || !item.bankInfo.qrData) return;

        if (cardRef.current) {
          setImg(buildSrcUrl(item.bankInfo.qrData));
        }
      };
      parseItem();

      return () => {
        abortController.abort();
        if (img) URL.revokeObjectURL(img);
      };
    }, [img, item]);

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
          style={{
            backgroundImage: item.bankInfo
              ? `url(${cardBgMap[item.bankInfo?.bank.bankName]})`
              : undefined,
          }}
          className={classNames(
            styles.cardContainer,
            !item?.bankInfo?.qrData && styles.hide,
            isRight && styles.justifyEnd,
          )}
        >
          {item.bankInfo && (
            <div className={styles.cardHeader}>
              {banksObject[item.bankInfo.bank.bankName].name}
            </div>
          )}
          <div className={styles.bottomContainer}>
            <div className={styles.cardFooterText}>
              <span>{item.bankInfo?.bank.bankNumber}</span>
              <span>---</span>
            </div>
            <img ref={cardRef} src={img} className={styles.card} />
          </div>
        </div>
      </div>
    );
  },
);

ChatItem.displayName = 'ChatItem';

export default memo(ChatItem);
