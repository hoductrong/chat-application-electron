import classNames from 'classnames';
import styles from './styles.module.scss';
import type { PropsWithChildren } from 'react';
import type React from 'react';

type ChatListProps = {
  className?: string;
};

const ChatList: React.FC<PropsWithChildren<ChatListProps>> = ({
  children,
  className,
}) => {
  return (
    <div className={classNames(styles.container, className)}>{children}</div>
  );
};

export default ChatList;
