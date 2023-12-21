import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Button from '../Button';
import styles from './styles.module.scss';
import Input from '../Input';
import useAuthHandler from 'src/renderer/hooks/useAuthHandler';

type AuthenticateWindowProps = {
  onClickSubmit(username: string): void;
};

const AuthenticateWindow: FC<AuthenticateWindowProps> = ({ onClickSubmit }) => {
  const [username, setUsername] = useState<string>('');
  const { init } = useAuthHandler();

  useEffect(() => {
    init();
  }, [init]);

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
          onClick={() => onClickSubmit(username)}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AuthenticateWindow;
