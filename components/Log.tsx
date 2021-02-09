import React, { useEffect, useState } from 'react';

interface LogProps {
  message: string;
}

const Log: React.FC<LogProps> = ({ message }) => {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    setMessages((oldMessages) => [...oldMessages, message]);
  }, [message]);

  return (
    <div id="messages">
      {messages.join('-')}
    </div>
  );
};

export default Log;
