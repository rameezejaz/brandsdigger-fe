// src/components/Chat.tsx
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { getBusinessName } from '../services/api';
import styles from '../styles/Chat.module.css';

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  // Create a ref for the chat input textarea
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const userMessage = message;
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage }]);
  
    try {
      const result = await getBusinessName(message);
  
      // Assuming result is an array of names
      if (Array.isArray(result)) {
        // Join the names with a line break and display them as a single message
        const joinedNames = result.join(' \n '); // This joins all names with a line break
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: joinedNames }, // Displaying all names in a single message
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'No valid response received.' },
        ]);
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'An error occurred, please try again later.' },
      ]);
    }
    setLoading(false);
    setMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSubmit(e);
      }
    }
  };
  useEffect(() => {
    if (chatInputRef.current) {
      const textarea = chatInputRef.current;
  
      const adjustHeight = () => {
        if (textarea.scrollHeight > textarea.clientHeight) {
          textarea.style.height = 'auto'; 
          textarea.style.height = `${textarea.scrollHeight}px`;
        } else {
          textarea.style.height = 'auto';
        }
      };
  
      textarea.addEventListener('input', adjustHeight);
  
      return () => {
        textarea.removeEventListener('input', adjustHeight);
      };
    }
  }, []);
  

  return (
    <div className="container-fluid">
          <div className="row">
            <div className="col-2 px-0">
              <div className={`${styles.shortlistedBox}`}>
                <h3 className={`${styles.shortlistedHeading}`}>Shortlisted Names</h3>
              </div>
            </div>
            <div className="col-9">
              <div className={`${styles.chatbotContainer} position-relative`}>
                <div className={`${styles.chatresponseContainer}`}>
                  {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? `${styles.userMessage} ${styles.responseBox}`: `${styles.botMessage} ${styles.responseBox}`}>
                      <p className='mb-0'>{msg.text}</p>
                    </div>
                  ))}
                  {loading && <div>Loading...</div>}
                </div>
                <div className={`input-group ${styles.chatInputBox}`}>
                  <textarea
                    className="form-control"
                    ref={chatInputRef}
                    placeholder="Start typing your business idea..."
                    aria-label="Start typing your business idea..."
                    aria-describedby="sendButton"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1} // Start with a single row
                  />
                  <button id="sendButton" type="submit" onClick={handleSubmit}>
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default Chat;
