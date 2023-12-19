import { mId } from 'src/handlers/ChatViewModel';
import type { ChatModel } from 'src/models/ChatModel';
import { useDataViewModel } from 'src/reactive';

const useMessageHandler = () => useDataViewModel<ChatModel>(mId);

export default useMessageHandler;
