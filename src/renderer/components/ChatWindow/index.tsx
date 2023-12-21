import { getViewModel } from 'src/reactive';
import type { AuthenticationViewModel } from 'src/handlers/AuthenticationViewModel';
import { mId as authId } from 'src/handlers/AuthenticationViewModel';
import { useEffect, useRef, useState } from 'react';
import useMessageHandler from 'src/renderer/hooks/useMessageHandler';
import Button from '../Button';
import styles from './styles.module.scss';
import Input from '../Input';
import ChatList from '../ChatList';
import ChatItem from '../ChatItem';
import AuthenticateWindow from '../AuthenticateWindow';
import useAuthHandler from 'src/renderer/hooks/useAuthHandler';
import { observer } from 'mobx-react-lite';

const authHandler = getViewModel<AuthenticationViewModel>(authId);

function ChatWindow() {
  const [message, setMessage] = useState<string>('');
  const {
    listMessages,
    sendMessage,
    setupReceivingMessage,
    currentConversation,
    isDisconnect,
    init,
    joinDefaultConversation,
  } = useMessageHandler();

  const isDisabled = !message || !currentConversation?.id || isDisconnect;
  const ref = useRef<HTMLDivElement>(null);
  useAuthHandler();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
    });
  }, [listMessages]);

  const onInputChange = (value: string) => {
    setMessage(value);
  };

  const onClickSubmit = async (username: string) => {
    await authHandler.startAuthenticate(username);
    await joinDefaultConversation();

    if (!currentConversation) return;
    setupReceivingMessage(currentConversation.id);
  };

  const renderAuthenticating = () => (
    <AuthenticateWindow onClickSubmit={onClickSubmit} />
  );

  return authHandler.currentUser !== null ? (
    <div className={styles.container}>
      {isDisconnect && (
        <div className={styles.disconnected}>Disconnected. Reconnecting...</div>
      )}
      <ChatList ref={ref} className={styles.chatList}>
        {listMessages.map((message) => (
          <ChatItem
            key={message.id}
            header={message.senderName}
            message={message.message}
            isRight={message.senderId === authHandler.currentUser?.id}
          />
        ))}
        {/* {new Array(1000).fill(0).map((_, index) => (
          <ChatItem
            key={index}
            header={`test${index}`}
            message={`test${index}`}
            isRight={index % 2 === 0}
          />
        ))} */}
      </ChatList>
      <form className={styles.chatInputContainer}>
        <Input
          value={message}
          className={styles.input}
          onChange={onInputChange}
        />
        <Button
          type="submit"
          isDisabled={isDisabled}
          className={styles.button}
          onClick={async () => {
            if (!message || !currentConversation?.id) return;

            await sendMessage({
              message,
              to: currentConversation.id,
            });
            setMessage('');
            ref.current?.scrollTo({
              top: ref.current.scrollHeight,
            });
          }}
        >
          Send
        </Button>
      </form>
    </div>
  ) : (
    renderAuthenticating()
  );
}

export default observer(ChatWindow);
