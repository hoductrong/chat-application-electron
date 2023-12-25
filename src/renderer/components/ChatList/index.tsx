import classNames from 'classnames';
import styles from './styles.module.scss';
import { forwardRef, memo, type PropsWithChildren } from 'react';
import type { Message } from 'src/lib/types';
import ChatItem from '../ChatItem';

type ChatListProps = {
  className?: string;
  items: Array<Message>;
  currentUserId: string | undefined;
};

const ChatList = forwardRef<HTMLDivElement, PropsWithChildren<ChatListProps>>(
  ({ className, items, currentUserId }, ref) => {
    return (
      <div ref={ref} className={classNames(styles.container, className)}>
        {items.map((message) => (
          <ChatItem
            key={message.id}
            header={message.senderName}
            message={message.message}
            isRight={message.senderId === currentUserId}
          />
        ))}
      </div>
    );
  },
);

ChatList.displayName = 'ChatList';

export default memo(ChatList);
