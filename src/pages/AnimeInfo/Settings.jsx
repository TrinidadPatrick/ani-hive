// SettingsButton.js
import videojs from 'video.js';

const Button = videojs.getComponent('Button');

class SettingsButton extends Button {
  constructor(player, options) {
    super(player, options);
    this.controlText('Settings');
    this.addClass('vjs-icon-cog');
    this.addClass('custom-settings-button'); // for targeting
  }

  handleClick() {
    this.player().trigger('toggleSettingsMenu');
  }
}

export default SettingsButton;
