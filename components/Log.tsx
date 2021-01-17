import React, { useEffect, useState } from 'react';

interface LogProps {
  message: string;
}

/**
 * Cypress does not yet support starting tests on DOMContentLoaded,
 * so it waits till all of the images are loaded, hence had to use `Log`,
 * see https://github.com/cypress-io/cypress/issues/440
 */
const Log: React.FC<LogProps> = ({ message }) => {
  const [messages, setMessages] = useState([]);
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
