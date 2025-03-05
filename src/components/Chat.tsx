import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { getBusinessName } from '../services/api';
import styles from '../styles/Chat.module.css';

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false); // State to control modal visibility

  // Create a ref for the chat input textarea
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Load previous messages from localStorage when the component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages)); // Set messages from localStorage if available
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages)); // Store messages in localStorage
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const userMessage = message;
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage }]);

    try {
      const result = await getBusinessName(message);

      if (Array.isArray(result)) {
        const joinedNames = result.join(' \n ');
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: joinedNames },
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(() => {
      console.error('Failed to copy text.');
    });
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

  // Function to handle modal actions
  const handleClearHistory = () => {
    localStorage.removeItem('chatMessages');
    setMessages([]);
    setShowModal(false); // Close the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal without clearing the history
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 px-0">
          <div className={`${styles.shortlistedBox}`}>
            <h3 className={`${styles.shortlistedHeading}`}>Shortlist</h3>
            <div className={`${styles.shortlistNameContainer}`}></div>
            <button 
              className={`btn btn-danger w-100`} 
              onClick={() => setShowModal(true)} // Show the modal when clicked
            >
              Reset History <i className="fa-solid fa-trash ms-2"></i>
            </button>
          </div>
        </div>
        <div className="col-9">
          <div className={`${styles.chatbotContainer} position-relative`}>
            <div className={`${styles.chatresponseContainer}`}>
              {messages.map((msg, index) => (
                msg.sender === 'user' ? 
                  <div key={index} className={`${styles.userMessage} ${styles.responseBox}`}>
                    <p className='mb-0'>{msg.text}</p>
                  </div> :
                  <div key={index} className={`${styles.botMessage} ${styles.responseBox}`}>
                    <p className='mb-0'>{msg.text.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex} className='d-flex align-items-center'>
                        <button className={styles.startButton}><i className="fa-solid fa-plus"></i></button>
                        <p className='mb-0'>{line}</p>
                        <button className={styles.copyButton} onClick={() => copyToClipboard(line)}>
                          <i className="fa-solid fa-copy"></i>
                        </button>
                      </div>
                    ))}</p>
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
                  <p className='mb-0'>Name copied!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for confirmation */}
      {showModal && (
        <div 
          className={`${styles.modalContainer} modal fade show`} 
          tabIndex={-1} 
          style={{ display: 'block', backdropFilter: 'blur(5px)', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1050 }} 
          aria-modal="true"
        >
          <div className={`${styles.modalDialog} modal-dialog`}>
            <div className="modal-content">
              <div className="modal-body">
                <p className={`${styles.modalText} mb-0`}>Ready for a fresh start? Clear chat history and shortlist now!</p>
              </div>
              <div className={`${styles.modalFooter} modal-footer d-flex justify-content-end`}>
                <button type="button" className={`${styles.clearBtn} btn me-2`} onClick={handleCloseModal}>
                  No, keep my data
                </button>
                <button type="button" className={`btn btn-danger`} onClick={handleClearHistory}>
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
