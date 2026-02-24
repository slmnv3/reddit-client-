import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import styles from './VideoPlayer.module.css';

export default function VideoPlayer({ hlsUrl, fallbackUrl, height }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try HLS stream first (has audio)
    if (hlsUrl && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn('HLS failed, falling back to video-only URL');
          video.src = fallbackUrl;
        }
      });

      return () => {
        hls.destroy();
      };
    }
    // Safari has native HLS support
    else if (hlsUrl && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
    }
    // Fallback to video without audio
    else if (fallbackUrl) {
      video.src = fallbackUrl;
    }
  }, [hlsUrl, fallbackUrl]);

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        className={styles.video}
        controls
        loop
        playsInline
        style={{ maxHeight: height ? `${height}px` : '500px' }}
      />
    </div>
  );
}