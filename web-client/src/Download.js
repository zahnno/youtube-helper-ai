import React, {useState} from 'react';

const Download = ({url}) => {
  const [downloading, setDownloading] = useState(false);

  const handleMP4Click = async () => {
    setDownloading(true);
    try {
      await fetch(`http://localhost:9000/download/mp4?url=${url}`)
      alert('MP4 downloaded to yt-dlp/downloads');
    } catch (error) {
      console.alert('Error downloading MP4:', error);
    }
    setDownloading(false);
  };
  
  const handleMP3Click = async () => {
    setDownloading(true);
    try {
      await fetch(`http://localhost:9000/download/mp3?url=${url}`)
      alert('MP3 downloaded to yt-dlp/downloads');
    } catch (error) {
      console.alert('Error downloading MP3:', error);
    }
    setDownloading(false);
  };

  return (
    <div style={styles.container}>
      { downloading && <h2 style={styles.header}>Downloading...</h2> }
      <button style={styles.button} onClick={handleMP4Click}>MP4</button>
      <button style={styles.button} onClick={handleMP3Click}>MP3</button>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    textAlign: 'center',
    margin: '0px 0px 20px 0px'
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  button: {
    width: '250px',
    padding: '10px 20px',
    fontSize: '16px',
    margin: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    outline: 'none',
  }
};

export default Download;
