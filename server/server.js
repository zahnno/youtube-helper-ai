const express = require('express');
const cors = require('cors');
const { getTranscript } = require('./transcriber');
const { geminiAIChat } = require('./gemini');
const { ollamaPrompt } = require('./ollamaPrompt');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

// In-memory store for transcripts
const transcripts = {};

// Helper function to handle AI chat requests
const handleAIChat = async (transcript, userInput, model) => {
  if (model === 'Gemini') {
    return geminiAIChat({ transcript, userInput });
  }
  return ollamaPrompt({ transcript, userInput, model });
};

// Endpoint to get transcript and store it
app.post('/transcript', (req, res) => {
  const videoUrl = req.body.url;

  getTranscript(videoUrl, (error, parsedText) => {
    if (error) {
      return res.status(error.status).json({ message: error.message });
    }
    transcripts[videoUrl] = parsedText;
    res.json({ parsedText });
  });
});

// Endpoint to chat with transcript context
app.post('/chat', async (req, res) => {
  const { userInput, videoUrl, model } = req.body;
  let transcript = transcripts[videoUrl];

  // If transcript is not in memory, fetch it
  if (!transcript) {
    getTranscript(videoUrl, async (error, parsedText) => {
      if (error) return res.status(error.status).json({ message: error.message });

      transcripts[videoUrl] = parsedText;
      transcript = parsedText;

      try {
        const response = await handleAIChat(transcript, userInput, model);
        res.json({ message: response });
      } catch (error) {
        res.status(500).json({ message: "There was an error processing your request." });
      }
    });
  } else {
    // Use the cached transcript
    try {
      const response = await handleAIChat(transcript, userInput, model);
      res.json({ message: response });
    } catch (error) {
      res.status(500).json({ message: "There was an error processing your request." });
    }
  }
});

// Endpoint to list available models
app.get('/models', (req, res) => {
  exec('ollama list', (error, stdout, stderr) => {
    if (error) {
      console.error('Execution error:', error);
      return res.status(500).json({ error: 'Failed to list models' });
    }

    let models = stdout.match(/(\S+:\S+)/g) || [];
    if (process.env.GEMINI_API_KEY) models.push('Gemini');
    res.json({ models });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
