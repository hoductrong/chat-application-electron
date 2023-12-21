import { useState } from 'react';
import type { ChatViewModel } from 'src/handlers/ChatViewModel';
import { mId } from 'src/handlers/ChatViewModel';
import { getViewModel } from 'src/reactive';

const messageHandler = getViewModel<ChatViewModel>(mId);
const useMessageHandler = () => {
  const [store] = useState<ChatViewModel>(messageHandler);

  return store;
};

export default useMessageHandler;
