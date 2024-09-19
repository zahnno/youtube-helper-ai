import './App.css';
import React from 'react';
import { useState } from 'react';

function App() {
  const [link, setLink] = useState('');
  const [captions, setCaptions] = useState('');

  const handleChange = (e) => {
    setLink(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted link:', link);
    try {
      const response = await fetch('http://localhost:4000/captions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link }),
      });
      const data = await response.json();
      setCaptions(data);
    } catch (error) {
      console.error('Error:', error);
      setCaptions('An error occurred. Please try again later.');
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '500px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  };

  const labelStyle = {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    padding: '10px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  };

  const buttonStyle = {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  return (
    <div className="app-body">
      <h1>Youtube Helper AI</h1>
      <form style={formStyle} onSubmit={handleSubmit}>
        <label htmlFor="linkInput" style={labelStyle}>Link:</label>
        <input
          type="text"
          id="linkInput"
          value={link}
          onChange={handleChange}
          placeholder="Enter a link"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

export default App;
