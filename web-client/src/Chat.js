import React, { useState } from 'react';

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://your-api-url.com/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: inputValue }),
      });

      const data = await response.json();
      setResponseMessage(data.message || 'Success!');
    } catch (error) {
      setResponseMessage('Error occurred while sending data.');
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    responseMessage: {
      textAlign: 'center',
      marginTop: '10px',
      color: '#007bff',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Ask your question about the video!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type something..."
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>
      {responseMessage && <p style={styles.responseMessage}>{responseMessage}</p>}
    </div>
  );
};

export default Chat;
