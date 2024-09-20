const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const session = require('express-session');
const { getTranscript } = require('./transcriber');
const { geminiAIChat } = require('./gemini');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

// Set up session management
app.use(session({
    secret: '38dba03e1256ff2a7e65a11153f0a6b0117f87502ac7897fe7177bd38e0571dd',
    resave: false,
    saveUninitialized: true,
}));

// In-memory store for transcripts
const transcripts = {};

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
app.post('/chat', (req, res) => {
  const { userInput } = req.body.userInput;
  const { url } = req.body.url;
  const transcript = transcripts[url];

  console.log('Previous transcript found:', transcript);

  if (!transcript) {
    getTranscript(url, (error, parsedText) => {
      if (error) return res.status(error.status).json({ message: error.message });
      transcripts[url] = parsedText;
      transcript = parsedText;
    });
  }

  if ( transcript && process.env.GEMINI_API_KEY ) {
    // execute gemini command chat
    try {
      const geminiResponse = geminiAIChat({ transcript, userInput });
      res.json({message: geminiResponse});
    } catch (error) {
      res.json({ message: "There was an error processing your request." });
    }
  } else {
    res.json({ message: "No transcript found for this url." });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
