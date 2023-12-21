import { useState } from 'react';
import type { AuthenticationViewModel } from 'src/handlers/AuthenticationViewModel';
import { mId } from 'src/handlers/AuthenticationViewModel';
import { getViewModel } from 'src/reactive';

const authHandler = getViewModel<AuthenticationViewModel>(mId);
const useAuthHandler = () => {
  const [store] = useState<AuthenticationViewModel>(authHandler);

  return store;
};

export default useAuthHandler;
