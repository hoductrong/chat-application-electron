import classNames from 'classnames';
import type { Range } from '@tanstack/react-virtual';
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import styles from './styles.module.scss';
import {
  forwardRef,
  memo,
  type PropsWithChildren,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import type { Message } from 'src/lib/types';
import ChatItem from '../ChatItem';

type ChatListProps = {
  className?: string;
  items: Array<Message>;
  currentUserId: string | undefined;
};

export type ChatListForwardedRef = {
  scrollToLastMessage: () => void;
};

const ChatList = forwardRef<
  ChatListForwardedRef,
  PropsWithChildren<ChatListProps>
>(({ className, items, currentUserId }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rangeRef = useRef<Range | null>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 80,
    getItemKey: useCallback((index: number) => items[index].id, [items]),
    rangeExtractor: useCallback((range: Range) => {
      rangeRef.current = range;

      return defaultRangeExtractor(range);
    }, []),
  });

  const _items = virtualizer.getVirtualItems();

  const scrollToIndex = (
    index: number,
    arg?: Parameters<typeof virtualizer.scrollToIndex>[1],
  ) => {
    virtualizer.scrollToIndex(index, arg);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const { startIndex, endIndex } = rangeRef.current as Range;

        const isVisible = index >= startIndex && index <= endIndex;

        if (!isVisible) {
          scrollToIndex(index, arg);
        }
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
        });
      });
    });
  };

  const scrollToLastMessage = () => {
    if (items.length <= 0) return;

    scrollToIndex(items.length - 1, {
      align: 'end',
    });
  };

  useImperativeHandle(ref, () => ({
    scrollToLastMessage,
  }));

  return (
    <div ref={containerRef} className={classNames(styles.container, className)}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${_items[0]?.start ?? 0}px)`,
          }}
        >
          {_items.map((virtualRow) => (
            <ChatItem
              key={virtualRow.key}
              dataIndex={virtualRow.index}
              ref={virtualizer.measureElement}
              header={items[virtualRow.index].senderName}
              message={items[virtualRow.index].message}
              isRight={items[virtualRow.index].senderId === currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

ChatList.displayName = 'ChatList';

export default memo(ChatList);
