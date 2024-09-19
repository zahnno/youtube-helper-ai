const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

function parseVTT(vttData) {
  const cleanedData = vttData
      .split('\n')
      .filter(line => {
          return !/^\d{2}:\d{2}:\d{2}/.test(line) && line.trim() !== '';
      })
      .join(' ')
      .replace(/<c>.*?<\/c>/g, '')
      .replace(/\[Music\]/g, '')
      .trim();

  const formattedText = cleanedData.replace(/\s+/g, ' ');
  const sentences = formattedText.split(' ')
      .map((word, index) => {
          if (word.toLowerCase() === 'and' && index < formattedText.split(' ').length - 1) {
              return word + ',';
          }
          return word;
      })
      .join(' ');

  const regex = /<\d{2}:\d{2}:\d{2}\.\d{3}>/g;
  const dialogueParts = sentences.trim().split(regex).filter(part => part.trim() !== '');
  const dialogue = dialogueParts.map(part => part.trim());

  return dialogue;
}

app.get('/transcript', (req, res) => {
    const videoUrl = req.body.url;

    exec(`yt-dlp --skip-download --write-auto-subs --sub-langs "en" https://www.youtube.com/watch?v=c0uyU53ma8Y`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }
        
        // Get the name of the downloaded subtitle file
        const subtitleFileName = stdout.match(/Writing video subtitles to: (.+)/)?.[1];
        
        if (subtitleFileName) {
            const subtitleFilePath = path.resolve(subtitleFileName);

            // Read the subtitle file
            fs.readFile(subtitleFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file: ${err.message}`);
                    return res.status(500).json({ error: err.message });
                }
                // Send the subtitle text back as the response
                parsedText = parseVTT(data);
                res.json({ parsedText });
            });
        } else {
            res.json({ transcript: "No subtitles found." });
        }
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
