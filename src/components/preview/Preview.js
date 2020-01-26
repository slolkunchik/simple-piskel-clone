import './style/style.css';
import template from './view/template';
import templateButtons from './view/templateButtons';

export default class Preview {
  constructor(events) {
    this.timeout = null;
    this.elem = null;
    this.fps = 1;
    this.events = events;
    this.timeoutTime = 1000;
    this.template = template;
    this.templateButtons = templateButtons;
  }

  init() {
    this.render();
    this.renderButtons();
    this.initClickListeners();
  }

  render() {
    document.querySelector('.right-column').insertAdjacentHTML('afterbegin', this.template);
  }

  renderButtons() {
    this.elem = document.querySelector('.preview');
    this.elem.insertAdjacentHTML('afterend', this.templateButtons);
  }

  initClickListeners() {
    document.querySelector('.preview-full_screen').addEventListener('click', () => {
      this.openFullscreen();
    });
    document.getElementById('preview-fps').addEventListener('input', (event) => {
      const fpsValue = event.target.value;
      const parseIntRadix = 10;
      document.getElementById('display-fps').innerText = `${fpsValue} FPS`;
      this.fps = parseInt(fpsValue, parseIntRadix);
      this.events.onRangeInput();
    });
  }

  animate(images) {
    const numberMsInOneSec = 1000;

    if (images.length === 0) {
      return;
    }
    this.images = images;
    this.timeoutTime = Math.floor(numberMsInOneSec / this.fps);
    clearTimeout(this.timeout);
    this.index = 0;
    this.timeout = setTimeout(this.animateHandler.bind(this), this.timeoutTime);
  }

  animateHandler() {
    if (this.index === this.images.length) {
      this.index = 0;
    }
    const smallImage = this.images[this.index].big;
    document.querySelector('.preview')
      .setAttribute('style',
        `background-image: url(${smallImage});`);
    this.index += 1;
    this.timeout = setTimeout(this.animateHandler.bind(this), this.timeoutTime);
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) { /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) { /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }
}
