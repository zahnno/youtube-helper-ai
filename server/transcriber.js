const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?[A-Za-z0-9_-]{11}$/;

function parseVTT(vttData) {
  const cleanedData = vttData
      .replace(/align:start position:\d+%/g, '')
      .replace(/\s+/g, ' ')
      .replace(/(\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3})/g, ',') // Remove timestamps and the separator
      .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '') // Remove timestamps
      .replace(/<c>(.*?)<\/c>/g, '$1') // Replace <c> tags with their contents
      .trim(); // Trim leading and trailing spaces

  return cleanedData.split('\n').map(segment => segment.trim()).filter(Boolean).join(' ');
}

function getTranscript(videoUrl, callback) {
    // Validate the YouTube URL
    if (!youtubeUrlRegex.test(videoUrl)) {
        return callback({ status: 400, message: "Invalid YouTube URL." });
    }

    // Execute yt-dlp to fetch transcript
    exec(`yt-dlp --skip-download --write-auto-subs --sub-langs "en" ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return callback({ status: 500, message: error.message });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return callback({ status: 500, message: stderr });
        }

        // Get the name of the downloaded VTT file
        const vttFileName = stdout.match(/Writing video subtitles to: (.+\.vtt)/)[1];

        // Read the VTT file
        fs.readFile(vttFileName, 'utf8', (err, vttData) => {
            if (err) {
                console.error(`Error reading file: ${err.message}`);
                return callback({ status: 500, message: err.message });
            }

            // Parse the VTT output
            const parsedText = parseVTT(vttData);
            console.log(parsedText)
            // Return parsed transcript via callback
            callback(null, parsedText);

            // Optionally, delete the file after reading
            fs.unlink(vttFileName, (unlinkErr) => {
                if (unlinkErr) console.error(`Error deleting file: ${unlinkErr.message}`);
            });
        });
    });
}

module.exports = { getTranscript };
