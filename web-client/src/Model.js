import React, { useState, useEffect } from 'react';

const Model = ({ setModel, model }) => {
  const [models, setModels] = useState([]);

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:9000/models');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setModels(data?.models);
      setModel(data?.models[0])
    } catch (error) {
      console.error('Error fetching local models:', error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleChange = (event) => {
    setModel(event.target.value);
  };

  return (
    <div className="dropdown-container">
      <select value={model} onChange={handleChange} className="dropdown-select">
        {models.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      { models?.length > 0 && <p style={{color: 'red'}}>Uh oh, looks like no models were found. Try setting up your gemini key or making sure your ollama service is running locally</p> }
    </div>
  );
};

export default Model;
