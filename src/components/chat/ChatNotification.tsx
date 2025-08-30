import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';

interface ChatNotificationProps {
  showOnLoad?: boolean;
  delay?: number;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({ showOnLoad = true, delay = 3000 }) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showOnLoad) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [showOnLoad, delay]);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <ChatWidget 
      showNotification={showNotification} 
      onCloseNotification={handleCloseNotification}
    />
  );
};

export default ChatNotification;