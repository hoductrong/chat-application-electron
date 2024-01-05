import classNames from 'classnames';
import styles from './styles.module.scss';
import type React from 'react';
import type { Message } from 'src/lib/types';
import ChatItem from '../ChatItem';
import { useRef } from 'react';

type ChunkChatItemProps = {
  className?: string;
  chunkedItem: {
    id: number;
    data: Message[];
  };
  currentUserId: string | undefined;
};

const ChunkChatItem: React.FC<ChunkChatItemProps> = ({
  chunkedItem,
  className,
  currentUserId,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={ref}
      className={classNames(styles.chunk, className)}
      key={chunkedItem.id}
    >
      {chunkedItem.data.map((message) => (
        <ChatItem
          key={message.id}
          header={message.senderName}
          message={message.message}
          isRight={message.senderId === currentUserId}
        />
      ))}
    </div>
  );
};

export default ChunkChatItem;
