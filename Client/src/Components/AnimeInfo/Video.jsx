import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoJS = ({ options, onReady }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });

      player.el().addEventListener('mouseenter', () => {
        player.controls(true);
      });
      player.el().addEventListener('mouseleave', () => {
        player.controls(false);
      });
      player.el().addEventListener('touchstart', () => {
        player.controls(true);
        clearTimeout(player._hideControlsTimeout);
        player._hideControlsTimeout = setTimeout(() => {
          player.controls(false);
        }, 3000);
      });

      // Optional: debug
      player.on('error', () => console.error('Error:', player.error()));
      player.on('play', () => console.log('Playing...'));
    } else {
      // If re-render, update source and autoplay if needed
      const player = playerRef.current;
      player.src(options.sources);
      player.autoplay(options.autoplay);
    }
  }, [options, onReady]);

  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;