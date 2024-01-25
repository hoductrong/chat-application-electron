import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import type { ChatListForwardedRef } from '../../components/ChatList';
import ChatList from '../../components/ChatList';
import { observer } from 'mobx-react-lite';
import { useConnectionStatus } from 'src/renderer/hooks/useConnectionStatus';
import { useNavigate } from 'react-router-dom';
import { useChatHandler } from 'src/modules/chat/chat.viewmodel';
import { useAuthHandler } from 'src/modules/auth/authentication.viewmodel';
import { AppError } from 'src/lib/types';
import { formatErrorMessage } from 'src/renderer/utils';
import ChatInput from 'src/renderer/components/ChatInput';
import { normalSamples } from 'src/perf/samples';

const ChatWindow = observer(() => {
  const {
    listMessages,
    sendMessage,
    currentConversation,
    joinDefaultConversation,
    setupReceivingMessage,
    parseBankQr,
  } = useChatHandler();

  const authHandler = useAuthHandler();
  const isConnected = useConnectionStatus();
  const [error, setError] = useState<AppError>(AppError.NO_ERROR);
  const [loading, setLoading] = useState(false);
  const ref = useRef<ChatListForwardedRef>(null);

  const navigate = useNavigate();

  const isDisabled = loading || !currentConversation?.id || !isConnected;

  useEffect(() => {
    const prefetch = async () => {
      if (!authHandler.sessionId) {
        navigate('/login');
      } else {
        setLoading(true);
        const { error: authError } = await authHandler.autoAuthenticate(
          authHandler.sessionId,
        );
        if (authError) {
          setError(authError);
        }
        setLoading(false);
      }
    };

    prefetch();
  }, [authHandler.sessionId]);

  useEffect(() => {
    const init = async () => {
      if (authHandler.sessionId) {
        await joinDefaultConversation();
        if (!currentConversation?.id) return;
        setupReceivingMessage(currentConversation.id);
      }
    };
    init();
    const remove = authHandler.addErrorHandlerListener();
    return () => {
      remove();
    };
  }, [authHandler.sessionId, currentConversation?.id]);

  const scrollToLastMessage = () => {
    if (!ref.current) return;
    ref.current.scrollToLastMessage?.();
  };

  useEffect(() => {
    scrollToLastMessage();
  }, []);

  if (error !== AppError.NO_ERROR) {
    return <div>{formatErrorMessage(error)}</div>;
  }

  return authHandler.currentUser !== null ? (
    <div className={styles.container}>
      {!loading && !isConnected && (
        <div className={styles.disconnected}>Disconnected. Reconnecting...</div>
      )}
      <ChatList
        parseQrCode={parseBankQr}
        ref={ref}
        currentUserId={authHandler.currentUser.id}
        items={normalSamples}
        className={styles.chatList}
      />
      <ChatInput
        isDisabled={isDisabled}
        onSubmit={async (message) => {
          if (!message || !currentConversation?.id) return;

          await sendMessage({
            message,
            to: currentConversation.id,
          });
          scrollToLastMessage();
        }}
      />
    </div>
  ) : (
    <></>
  );
});

export default ChatWindow;
