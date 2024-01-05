import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import styles from './styles.module.scss';
import Input from '../../components/Input';
import type { ChatListForwardedRef } from '../../components/ChatList';
import ChatList from '../../components/ChatList';
import { observer } from 'mobx-react-lite';
import { useConnectionStatus } from 'src/renderer/hooks/useConnectionStatus';
import { useNavigate } from 'react-router-dom';
import { useChatHandler } from 'src/modules/chat/chat.viewmodel';
import { useAuthHandler } from 'src/modules/auth/authentication.viewmodel';
import type { Message } from 'src/lib/types';

// const listMessages: Message[] = new Array(500).fill(0).map((_, index) => ({
//   id: index,
//   senderId: index % 10 === 1 ? '7694cf23-b50b-4c2f-a038-1ce97f277a2c' : '1',
//   senderName: 'John Doe',
//   message: new Array(index % 10).fill('Hello world').join(''),
//   conversationId: '1',
//   createdAt: Date.now(),
// }));

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
  const ref = useRef<ChatListForwardedRef>(null);

  const navigate = useNavigate();

  const isDisabled = !message || !currentConversation?.id || !isConnected;

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

  const scrollToLastMessage = () => {
    if (!ref.current) return;
    ref.current.scrollToLastMessage?.();
  };

  useEffect(() => {
    scrollToLastMessage();
  }, []);

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
          placeholder="Type your message here..."
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
            scrollToLastMessage();
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
