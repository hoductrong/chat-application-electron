import { useEffect, useState } from 'react';
import { socketManager } from 'src/lib/socket/SocketManager';

export const useConnectionStatus = (): boolean => {
  const [isConnected, setIsConnected] = useState(socketManager.isConnected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socketManager.onReconnect(onConnect);
    socketManager.onDisconnect(onDisconnect);
    socketManager.onConnect(onConnect);

    return () => {
      socketManager.offReconnect(onConnect);
      socketManager.offDisconnect(onDisconnect);
      socketManager.offConnect(onConnect);
    };
  }, []);

  return isConnected;
};
