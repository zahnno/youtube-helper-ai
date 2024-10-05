import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const Chat = ({ url, model }) => {
  const [inputValue, setInputValue] = useState('');
  const [responseMessages, setResponseMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const chatContainerRef = useRef(null); // Reference to the chat container

  // Scroll to the bottom whenever responseMessages changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [responseMessages]);

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents newline when 'Enter' is pressed
      handleSubmit(event);    // Calls the submit function
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const userText = inputValue;

      // Clear the input after submission
      setInputValue('');

      setResponseMessages((prevMessages) => [
        ...prevMessages,
        { message: inputValue, timestamp: new Date().toLocaleString(), user: true },
      ]);

      const response = await fetch('http://localhost:9000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: userText, videoUrl: url, model: model }),
      });

      const data = await response.json();

      // Get the current timestamp
      const timestamp = new Date().toLocaleString();
      console.log('response AI:', data.message);

      // Push new message and timestamp to responseMessages
      setResponseMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, timestamp, user: false },
      ]);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      // Handle error with timestamp
      const timestamp = new Date().toLocaleString();
      setResponseMessages((prevMessages) => [
        ...prevMessages,
        { message: 'Error occurred while sending data.', timestamp },
      ]);
    }
  };

  const styles = {
    container: {
      width: '500px',
      margin: '0 auto',
      padding: '15px 40px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    input: {
      width: '96%',
      height: '100px',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      marginBottom: '10px',
      outline: 'none',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      borderRadius: '6px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
    chatContainer: {
      marginTop: '20px',
      maxHeight: '400px',
      overflowY: 'auto',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '25px',
    },
    chatBubble: {
      backgroundColor: '#fff',
      padding: '10px 15px',
      borderRadius: '20px',
      marginBottom: '10px',
      maxWidth: '80%',
      alignSelf: 'flex-start',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    },
    userChatBubble: {
      backgroundColor: '#dcf8c6',
      padding: '10px 15px',
      borderRadius: '20px',
      marginBottom: '10px',
      maxWidth: '80%',
      alignSelf: 'flex-end',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      left: '90px',
    },
    messageText: {
      fontSize: '14px',
      color: '#333',
      margin: 0,
      float: 'left'
    },
    timestamp: {
      fontSize: '12px',
      color: '#999',
      marginTop: '5px',
      display: 'block',
      textAlign: 'right',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Ask your question about the video!</h2>
      <div style={styles.chatContainer} ref={chatContainerRef}>
        {responseMessages &&
          responseMessages.map((response, index) => (
            <div
              key={index}
              style={response.user ? styles.userChatBubble : styles.chatBubble}
            >
              {response.user ? <p style={styles.messageText}>{response.message}</p> : <ReactMarkdown style={styles.messageText}>{response.message}</ReactMarkdown> }
              <span style={styles.timestamp}>{response.timestamp}</span>
            </div>
          ))}
        {isProcessing && ( <p styles={{fontSize: '16px', fontWeight: 'bold' }}>...</p> )}
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type something..."
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default Chat;
