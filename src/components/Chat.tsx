import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { getBusinessName } from '../services/api';
import styles from '../styles/Chat.module.css';

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shortlist, setShortlist] = useState<string[]>([]); // State for shortlist

  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedShortlist = localStorage.getItem('shortlist');
    if (savedShortlist) {
      setShortlist(JSON.parse(savedShortlist));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (shortlist.length > 0) {
      localStorage.setItem('shortlist', JSON.stringify(shortlist));
    }
  }, [shortlist]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const userMessage = message;
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage }]);

    try {
      const result = await getBusinessName(message);
      const responseText = Array.isArray(result) ? result.join('\n') : 'No valid response received.';

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: responseText },
      ]);
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
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => console.error('Failed to copy text.'));
  };

  useEffect(() => {
    if (chatInputRef.current) {
      const textarea = chatInputRef.current;
      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      textarea.addEventListener('input', adjustHeight);
      return () => textarea.removeEventListener('input', adjustHeight);
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('shortlist');
    setMessages([]);
    setShortlist([]);
    setShowModal(false);
  };

  const addToShortlist = (name: string) => {
    setShortlist((prevShortlist) => [...prevShortlist, name]);
  };

  const removeFromShortlist = (name: string) => {
    setShortlist((prevShortlist) => prevShortlist.filter((item) => item !== name));
  };

  return (
    <div className="d-flex">
      <div className={`${styles.bdShortlistColumn}`}>
        <div className={styles.shortlistedBox}>
          <h3 className={styles.shortlistedHeading}>Shortlist</h3>
          <div className={`${styles.shortlistNameContainer} py-4`}>
            {shortlist.map((item, index) => (
              <div key={index} className="d-flex align-items-center">
                <button className={styles.startButton} onClick={() => removeFromShortlist(item)}>
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="mb-0">{item}</span>
                <button className={styles.copyButton} onClick={() => copyToClipboard(item)}>
                  <i className="fa-solid fa-copy"></i>
                </button>
              </div>
            ))}
          </div>
          <button className={`${styles.btnClearHistory} btn w-100`} onClick={() => setShowModal(true)}>
            Reset History <i className="fa-solid fa-trash ms-2"></i>
          </button>
        </div>
      </div>

      <div className={`${styles.bdChatBoxColumn}`}>
        <div className={`${styles.chatbotContainer} position-relative`}>
          <div className={styles.chatresponseContainer}>
            {messages.map((msg, index) => (
              <div key={index} className={`${msg.sender === 'user' ? styles.userMessage : styles.botMessage} ${styles.responseBox}`}>
                {msg.sender === 'user' ? (
                  <p className="mb-0">{msg.text}</p>
                ) : (
                  msg.text.split('\n').map((line, lineIndex) => (
                    <div key={lineIndex} className="d-flex align-items-center">
                      <button className={styles.startButton} onClick={() => addToShortlist(line)}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                      <span className="mb-0">{line}</span>
                      <button className={styles.copyButton} onClick={() => copyToClipboard(line)}>
                        <i className="fa-solid fa-copy"></i>
                      </button>
                    </div>
                  ))
                )}
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
              rows={1}
            />
            <button id="sendButton" type="submit" onClick={handleSubmit}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
            {isCopied && (
              <div className={styles.floatingText}>
                <p className="mb-0">Name copied!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className={`${styles.modalContainer} modal fade show`} tabIndex={-1} style={{ display: 'block', backdropFilter: 'blur(5px)', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1050 }} aria-modal="true">
          <div className={`${styles.modalDialog} modal-dialog`}>
            <div className="modal-content">
              <div className="modal-body">
                <p className={`${styles.modalText} mb-0`}>Ready for a fresh start? Clear chat history and shortlist now!</p>
              </div>
              <div className={`${styles.modalFooter} modal-footer d-flex justify-content-end`}>
                <button type="button" className={`${styles.clearBtn} btn me-2`} onClick={() => setShowModal(false)}>
                  No, keep my data
                </button>
                <button type="button" className="btn btn-danger" onClick={handleClearHistory}>
                  Yes, clear everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
