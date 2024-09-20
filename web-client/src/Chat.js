import React, { useState } from 'react';

const Chat = ({url, link}) => {
  const [inputValue, setInputValue] = useState('');
  const [responseMessages, setResponseMessages] = useState([]);

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: inputValue, url: link }),
      });

      const data = await response.json();
      
      // Get the current timestamp
      const timestamp = new Date().toLocaleString();

      // Push new message and timestamp to responseMessages
      setResponseMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message || 'Success!', timestamp },
      ]);

      // Clear the input after submission
      setInputValue('');
    } catch (error) {
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
      maxWidth: '400px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      color: '#333',
    },
    input: {
      width: '100%',
      height: '150px',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
      fontSize: '16px',
      lineHeight: '1.5',
      resize: 'vertical',
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
      verticalAlign: 'top',  
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
        <textarea
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type something..."
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>
      <div>
        {responseMessages && <p style={styles.responseMessage}>{responseMessages.message}</p>}
      </div>
    </div>
  );
};

export default Chat;
