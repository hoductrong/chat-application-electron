import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import styles from './styles.module.scss';
import Input from '../../components/Input';
import ChatList from '../../components/ChatList';
import { observer } from 'mobx-react-lite';
import { useConnectionStatus } from 'src/renderer/hooks/useConnectionStatus';
import { useNavigate } from 'react-router-dom';
import { useChatHandler } from 'src/modules/chat/chat.viewmodel';
import { useAuthHandler } from 'src/modules/auth/authentication.viewmodel';

function ChatWindow() {
  const [message, setMessage] = useState<string>('');
  const {
    listMessages,
    sendMessage,
    currentConversation,
    joinDefaultConversation,
    setupReceivingMessage,
  } = useChatHandler();
  const authHandler = useAuthHandler();
  const isConnected = useConnectionStatus();

  const navigate = useNavigate();

  const isDisabled = !message || !currentConversation?.id || !isConnected;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authHandler.sessionId) {
      navigate('/login');
    } else {
      authHandler.autoAuthenticate(authHandler.sessionId);
    }
  }, [navigate, authHandler.sessionId, authHandler]);

  useEffect(() => {
    const init = async () => {
      if (authHandler.sessionId) {
        await joinDefaultConversation();
        if (!currentConversation) return;
        setupReceivingMessage(currentConversation.id);
      }
    };
    init();
    const remove = authHandler.addErrorHandlerListener();
    return () => {
      remove();
    };
  }, [
    authHandler,
    currentConversation,
    joinDefaultConversation,
    setupReceivingMessage,
  ]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
    });
  }, [listMessages]);

  const onInputChange = (value: string) => {
    setMessage(value);
  };

  return authHandler.currentUser !== null ? (
    <div className={styles.container}>
      {!isConnected && (
        <div className={styles.disconnected}>Disconnected. Reconnecting...</div>
      )}
      <ChatList
        ref={ref}
        currentUserId={authHandler.currentUser.id}
        items={listMessages}
        className={styles.chatList}
      />
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
    <></>
  );
}

export default observer(ChatWindow);
