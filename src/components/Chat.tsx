// src/components/Chat.tsx
import React, { useState, FormEvent } from 'react';
import { getBusinessName } from '../services/api';
import styles from '../styles/Chat.module.css';

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getBusinessName(message);
      setResponse(result.message);  // Assuming the response contains a "message" field
    } catch (error) {
      setResponse('An error occurred, please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.chatContainer}>
      <h1>Business Name Finder</h1>
      <div className={styles.chatBox}>
        <div className={styles.messages}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p><strong>User:</strong> {message}</p>
              {response && <p><strong>Response:</strong> {response}</p>}
            </>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your business details"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary mt-2">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
