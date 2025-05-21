import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import SettingsButton from './Settings';

export const VideoJS = ({ options, onReady, setShowSettings, setButtonRect, changeQuality }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      });

      // if (!videojs.getComponent('SettingsButton')) {
      //   videojs.registerComponent('SettingsButton', SettingsButton);
      // }
  
      // const settingsButton = player.controlBar.addChild('SettingsButton', {});
      // player.controlBar.el().appendChild(settingsButton.el());

      // player.on('toggleSettingsMenu', ()=>{
      //   const btnEl = document.querySelector('.custom-settings-button');
      //   if (btnEl) {
      //     const rect = btnEl.getBoundingClientRect();
      //     setButtonRect(rect);
      //   }
      //   setShowSettings(prev => !prev);
      // })

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

    } else {
      // If re-render, update source and autoplay if needed
      const player = playerRef.current;
      player.src(options.sources);
      player.autoplay(options.autoplay);
    }
  }, []);

  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;