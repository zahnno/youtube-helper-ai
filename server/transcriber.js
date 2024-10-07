const { exec } = require('child_process');
const fs = require('fs');
const { get } = require('https');

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

function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
      exec(`yt-dlp -J ${url}`, (error, stdout, stderr) => {
          if (error) {
              console.error(`Error: ${error.message}`);
              reject(error);
              return;
          }
          if (stderr) {
              console.error(`Error: ${stderr}`);
              reject(stderr);
              return;
          }

          try {
              // Parse the output into JSON
              const videoInfo = JSON.parse(stdout);
              
              // Extracting required fields
              const data = {
                  title: videoInfo.title,
                  description: videoInfo.description,
                  channel: videoInfo.uploader,
              };

              resolve(data);
          } catch (parseError) {
              console.error('Error parsing JSON:', parseError);
              reject(parseError);
          }
      });
  });
}

function generateString(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getTranscript(videoUrl, callback) {
    // Validate the YouTube URL
    if (!youtubeUrlRegex.test(videoUrl)) {
        return callback({ status: 400, message: "Invalid YouTube URL." });
    }

    // Execute yt-dlp to fetch transcript
    const fileName = generateString();
    exec(`yt-dlp --skip-download --write-auto-subs --sub-langs "en" -o "./${fileName}.%(ext)s" ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return callback({ status: 500, message: error.message });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return callback({ status: 500, message: stderr });
        }

        // Append transcript extension
        const fileNameExt = fileName + '.en.vtt'

        // Read the VTT file
        fs.readFile(fileNameExt, 'utf8', (err, vttData) => {
            if (err) {
                console.error(`Error reading file: ${err.message}`);
                return callback({ status: 500, message: err.message });
            }

            // Parse the VTT output
            let parsedText = parseVTT(vttData);

            fs.unlink(fileNameExt, (unlinkErr) => {
                if (unlinkErr) console.error(`Error deleting file: ${unlinkErr.message}`);
            });

            getVideoInfo(videoUrl).then((videoInfo) => {
                parsedText += `\n\nTitle: ${videoInfo.title}\nDescription: ${videoInfo.description}\nChannel: ${videoInfo.channel}`;
                return callback(null, parsedText);
            }).catch((error) => {
                console.log('Error hit', error)
              return callback({ status: 500, message: error });
            });
        });
    });
}

module.exports = { getTranscript };
