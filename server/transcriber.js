const { exec } = require('child_process');

const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?[A-Za-z0-9_-]{11}$/;

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

function getTranscript(videoUrl, callback) {
    // Validate the YouTube URL
    if (!youtubeUrlRegex.test(videoUrl)) {
        return callback({ status: 400, message: "Invalid YouTube URL." });
    }

    // Execute yt-dlp to fetch transcript
    exec(`yt-dlp --skip-download --write-auto-subs --sub-langs "en" --stdout ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return callback({ status: 500, message: error.message });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return callback({ status: 500, message: stderr });
        }

        // Parse the VTT output (you may need to adjust the parseVTT function)
        const parsedText = parseVTT(stdout);

        // Return parsed transcript via callback
        callback(null, parsedText);
    });
}

module.exports = { getTranscript };
