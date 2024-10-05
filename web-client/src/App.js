import './App.css';
import React from 'react';
import { useState } from 'react';
import YouTubePreview from './YouTubePreview';
import Chat from './Chat';
import Download from './Download';
import ReactMarkdown from 'react-markdown';
import { markdownContentIntro } from './introText';
import Model from './Model';

const isValidYouTubeUrl = (url) => {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return regex.test(url);
};

function App() {
  const [link, setLink] = useState('');
  const [model, setModel] = useState('');

  const handleChange = (e) => {
    setLink(e.target.value);
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

  const isValidUrl = link && isValidYouTubeUrl(link);

  return (
    <div className="app-body">
      <div style={{ width: '600px'}}>
        <ReactMarkdown>{markdownContentIntro}</ReactMarkdown>
      </div>
      <Model model={model} setModel={setModel} />
      <form style={formStyle} onSubmit={null}>
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
      </form>
      { isValidUrl && <YouTubePreview url={link} /> }
      { isValidUrl && <Download url={link} /> }
      { isValidUrl && <Chat url={link} model={model} /> }
      { link && !isValidUrl && <p style={{color: 'red'}}>Please enter a valid YouTube URL.</p> }
    </div>
  );
};

export default App;
