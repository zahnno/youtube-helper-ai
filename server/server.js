const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

// Set up session management
app.use(session({
    secret: 'your_secret_key', // Change this to a secure random value
    resave: false,
    saveUninitialized: true,
}));

// In-memory store for transcripts
const transcripts = {};

function parseVTT(vttData) {
    const cleanedData = vttData
        .split('\n')
        .filter(line => !/^\d{2}:\d{2}:\d{2}/.test(line) && line.trim() !== '')
        .join(' ')
        .replace(/<c>.*?<\/c>/g, '')
        .replace(/\[Music\]/g, '')
        .trim();

    return cleanedData.replace(/\s+/g, ' ').trim();
}

app.post('/transcript', (req, res) => {
    const videoUrl = req.body.url;

    exec(`yt-dlp --skip-download --write-auto-subs --sub-langs "en" --stdout ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        // Parse the output directly without saving to a file
        const parsedText = parseVTT(stdout);

        // Store the transcript in the session
        transcripts[req.session.id] = parsedText;

        res.json({ parsedText });
    });
});

// Endpoint to retrieve transcript for the current session
app.get('/transcript', (req, res) => {
    const userTranscript = transcripts[req.session.id];

    if (userTranscript) {
        res.json({ transcript: userTranscript });
    } else {
        res.json({ message: "No transcript found for this session." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
