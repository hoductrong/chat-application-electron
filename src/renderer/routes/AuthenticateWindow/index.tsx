import type { FC } from 'react';
import { useState } from 'react';
import Button from '../../components/Button';
import styles from './styles.module.scss';
import Input from '../../components/Input';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { formatErrorMessage } from 'src/renderer/utils';
import { useChatHandler } from 'src/modules/chat/chat.viewmodel';
import { useAuthHandler } from 'src/modules/auth/authentication.viewmodel';
import useLoading from 'src/renderer/hooks/useLoading';

const AuthenticateWindow: FC = () => {
  const [username, setUsername] = useState<string>('');
  const { startAuthenticate, error } = useAuthHandler();
  const { joinDefaultConversation, setupReceivingMessage } = useChatHandler();
  const navigate = useNavigate();
  const [authenticate, loading] = useLoading(startAuthenticate);

  const onInputChange = (value: string) => {
    setUsername(value);
  };

  const onSubmit = async () => {
    const { error: authError } = await authenticate(username);
    if (authError) {
      return;
    }
    const conversation = await joinDefaultConversation();

    if (!conversation) return;
    setupReceivingMessage(conversation.id);
    navigate('/');
  };

  return (
    <div className={styles.container}>
      {!!error && (
        <div className={styles.error}>{formatErrorMessage(error)}</div>
      )}
      <b>Please input your username</b>
      <form className={styles.chatInputContainer}>
        <Input
          value={username}
          className={styles.input}
          onChange={onInputChange}
        />
        <Button
          isDisabled={!username || loading}
          type="submit"
          className={styles.button}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default observer(AuthenticateWindow);
