import React, { createContext, useContext, useEffect} from 'react';
import type { ReactNode } from 'react';
import { socketService } from '../lib/socket';

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      socketService.connect(token);
      setIsConnected(socketService.isConnected());

      // Update connection status
      const checkConnection = setInterval(() => {
        setIsConnected(socketService.isConnected());
      }, 1000);

      return () => {
        clearInterval(checkConnection);
      };
    } else {
      socketService.disconnect();
      setIsConnected(false);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
