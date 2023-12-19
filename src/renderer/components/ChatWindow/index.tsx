import { getViewModel } from 'src/reactive';
import type { ChatViewModel } from 'src/handlers/ChatViewModel';
import type { AuthenticationViewModel } from 'src/handlers/AuthenticationViewModel';
import { mId as chatId } from 'src/handlers/ChatViewModel';
import { mId as authId } from 'src/handlers/AuthenticationViewModel';
import { useEffect, useState } from 'react';
import useMessageHandler from 'src/renderer/hooks/useMessageHandler';
import Button from '../Button';
import styles from './styles.module.scss';
import Input from '../Input';
import ChatList from '../ChatList';
import ChatItem from '../ChatItem';
import AuthenticateWindow from '../AuthenticateWindow';
import useAuthHandler from 'src/renderer/hooks/useAuthHandler';

const messageHandler = getViewModel<ChatViewModel>(chatId);
const authHandler = getViewModel<AuthenticationViewModel>(authId);

export default function ChatWindow() {
  const [message, setMessage] = useState<string>('');
  useMessageHandler();
  useAuthHandler();

  useEffect(() => {
    const startup = async () => {
      if (authHandler.isAuthenticated) {
        await messageHandler.joinDefaultConversation();
        if (!messageHandler.currentConversation) return;
        messageHandler.setupReceivingMessage(
          messageHandler.currentConversation.id,
        );
      }
    };

    startup();
  }, []);

  const onInputChange = (value: string) => {
    setMessage(value);
  };

  const onClickSubmit = async (username: string) => {
    await authHandler.startAuthenticate(username);
    await messageHandler.joinDefaultConversation();

    if (!messageHandler.currentConversation) return;
    messageHandler.setupReceivingMessage(messageHandler.currentConversation.id);
  };

  const renderAuthenticating = () => (
    <AuthenticateWindow onClickSubmit={onClickSubmit} />
  );

  return authHandler.currentUser !== null ? (
    <div className={styles.container}>
      <ChatList className={styles.chatList}>
        {messageHandler.listMessages.map((message) => (
          <ChatItem
            key={message.id}
            header={message.senderName}
            message={message.message}
            isRight={message.senderId === authHandler.currentUser?.id}
          />
        ))}
      </ChatList>
      <form className={styles.chatInputContainer}>
        <Input
          value={message}
          className={styles.input}
          onChange={onInputChange}
        />
        <Button
          type="submit"
          className={styles.button}
          onClick={async () => {
            if (!message || !messageHandler?.currentConversation?.id) return;

            await messageHandler.sendMessage({
              message,
              to: messageHandler.currentConversation.id,
            });
            setMessage('');
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
