import React, { useEffect, useRef } from 'react';

function YouTubePreview({ url }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(new URL(url).search);
    const videoId = params.get('v');

    if (videoId) {
      const iframe = iframeRef.current;
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    }
  }, [url]);

  return (
    <div className="youtube-preview-container">
      <iframe title="YouTube Video Preview" ref={iframeRef} allowFullScreen></iframe>
    </div>
  );
}

export default YouTubePreview;