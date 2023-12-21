import classNames from 'classnames';
import styles from './styles.module.scss';
import { forwardRef, type PropsWithChildren } from 'react';

type ChatListProps = {
  className?: string;
};

const ChatList = forwardRef<HTMLDivElement, PropsWithChildren<ChatListProps>>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={classNames(styles.container, className)}>
        {children}
      </div>
    );
  },
);

ChatList.displayName = 'ChatList';

export default ChatList;
