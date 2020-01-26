import UPNG from 'upng-js';
import download from 'downloadjs';
import GIF from '../../../node_modules/gif.js.optimized/dist/gif';

import './style/style.css';
import template from './view/template';

export default class Export {
  constructor(events) {
    this.events = events;
    this.UPNG = UPNG;
    this.download = download;
    this.template = template;
  }

  init() {
    this.render();
    this.initClickListeners();
    this.initKeyListeners();
  }

  render() {
    document.querySelector('.right-column').insertAdjacentHTML('beforeend', this.template);
  }

  initClickListeners() {
    document.querySelector('.export').addEventListener('click', (event) => {
      const targetEl = event.target;
      if (!targetEl.closest('.export-button')) {
        return;
      }
      this.events.onExportClick((canvasArray, size, delay) => {
        if (targetEl.classList.contains('export-button--apng')) {
          const apngCode = this.encodeUPNG(canvasArray, size, delay);
          this.download(apngCode, 'simple-piskel-clone.apng', 'apng');
        }
        if (targetEl.classList.contains('export-button--gif')) {
          this.getGIF(canvasArray, size, delay);
        }
      });
    });
  }

  initKeyListeners() {
    document.addEventListener('keyup', (event) => {
      const { code } = event;
      switch (code) {
        case 'KeyG':
          this.events.onExportClick((canvasArray, size, delay) => {
            this.getGIF(canvasArray, size, delay);
          });
          break;
        case 'KeyN':
          this.events.onExportClick((canvasArray, size, delay) => {
            const apngCode = this.encodeUPNG(canvasArray, size, delay);
            this.download(apngCode, 'simple-piskel-clone.apng', 'apng');
          });
          break;
        default:
          break;
      }
    });
  }

  encodeUPNG(canvasArray, size, delay) {
    const cnum = 0;
    const startPositionX = 0;
    const startPositionY = 0;
    const arrayBuffer = canvasArray.map((canvas) => canvas.getContext('2d')
      .getImageData(startPositionX, startPositionY, size, size).data.buffer);
    const delayArr = new Array(arrayBuffer.length).fill(delay);
    return this.UPNG.encode(arrayBuffer, size, size, cnum, delayArr);
  }

  getGIF(canvasArray, size, delay) {
    this.gif = new GIF({
      workers: 2,
      quality: 10,
      width: size,
      height: size,
    });
    canvasArray.forEach((canvasEl) => this.gif.addFrame(
      canvasEl.getContext('2d'),
      { copy: false, delay },
    ));
    this.gif.on('finished', (gif) => {
      this.download(gif, 'simple-piskel-clone.gif', 'gif');
    });
    this.gif.render();
  }
}
