import { getViewModel } from 'src/reactive';
import type { AuthenticationViewModel } from 'src/handlers/AuthenticationViewModel';
import { mId } from 'src/handlers/AuthenticationViewModel';
import { useState } from 'react';
import Button from '../Button';
import styles from './styles.module.scss';
import Input from '../Input';
import useAuthHandler from 'src/renderer/hooks/useAuthHandler';

const authHandler = getViewModel<AuthenticationViewModel>(mId);

export default function AuthenticateWindow() {
  const [username, setUsername] = useState<string>('');
  useAuthHandler();

  const onInputChange = (value: string) => {
    setUsername(value);
  };

  return (
    <div className={styles.container}>
      <b>Please input your username</b>
      <form className={styles.chatInputContainer}>
        <Input
          value={username}
          className={styles.input}
          onChange={onInputChange}
        />
        <Button
          type="submit"
          className={styles.button}
          onClick={async () => {
            await authHandler.startAuthenticate(username);
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
