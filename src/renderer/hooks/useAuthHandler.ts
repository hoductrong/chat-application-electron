import { mId } from 'src/handlers/AuthenticationViewModel';
import type { AuthenticateModel } from 'src/models/AuthenticateModel';
import { useDataViewModel } from 'src/reactive';

const useAuthHandler = () => useDataViewModel<AuthenticateModel>(mId);

export default useAuthHandler;
