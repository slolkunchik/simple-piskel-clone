import './style/style.css';
import template from './view/template';
import templateSizeButtons from './view/templateSizeButtons';

export default class Canvas {
  constructor(events, size) {
    this.events = events;
    this.x0 = 0;
    this.y0 = 0;
    this.size = size;
    this.template = template;
    this.templateSizeButtons = templateSizeButtons;
    this.hideSelector = 'canvas-hide';
  }

  init() {
    this.render();
    this.renderSizeButtons();
    this.addCanvas();
    this.initMouseListeners();
    this.initClickListeners();
  }

  render() {
    document.querySelector('.canvas_box').insertAdjacentHTML('beforeend', this.template);
  }

  renderSizeButtons() {
    document.querySelector('.right-column')
      .insertAdjacentHTML('beforeend', this.templateSizeButtons);
  }

  addCanvas() {
    document.querySelectorAll('.canvas').forEach((canvasEl) => this.hide(canvasEl));

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.setAttribute('width', this.size);
    canvas.setAttribute('height', this.size);
    document.getElementById('canvas-frames-holder').appendChild(canvas);
    this.activeCanvas = canvas;
    this.activeCanvas.getContext('2d').imageSmoothingEnabled = false;
  }

  copyCanvas(canvas, number) {
    const canvasCopy = canvas.cloneNode(true);
    const startPosX = 0;
    const startPosY = 0;
    canvasCopy.getContext('2d').drawImage(canvas, startPosX, startPosY, this.size, this.size);
    this.show(canvasCopy);
    document.querySelector(`.canvas-frames-holder > .canvas:nth-child(${number + 1})`).after(canvasCopy);
    this.activeCanvas = canvasCopy;
  }

  getMousePos(canvas, event) {
    this.rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(event.clientX - this.rect.left),
      y: Math.floor(event.clientY - this.rect.top),
    };
  }

  initMouseListeners() {
    const canvases = document.getElementById('canvas-frames-holder');
    canvases.addEventListener('mousedown', (event) => {
      const canvas = event.target.closest('.canvas');
      const endPosition = this.getMousePos(canvas, event);
      this.events.onMouseDown({ x: this.x0, y: this.y0 }, endPosition, canvas, this.size);
      this.x0 = endPosition.x;
      this.y0 = endPosition.y;
      this.dx0 = endPosition.x;
      this.dy0 = endPosition.y;
    });
    canvases.addEventListener('mousemove', (event) => {
      const canvas = event.target.closest('.canvas');
      if (!canvas) {
        return;
      }
      const endPosition = this.getMousePos(canvas, event);
      this.events.onMouseMove({ x: this.x0, y: this.y0 }, endPosition, canvas, this.size);
      this.x0 = endPosition.x;
      this.y0 = endPosition.y;
    });
    canvases.addEventListener('mouseup', (event) => {
      const canvas = event.target.closest('.canvas');
      const endPosition = this.getMousePos(canvas, event);
      this.events.onMouseUp({ x: this.dx0, y: this.dy0 }, endPosition, canvas, this.size);
      this.x0 = endPosition.x;
      this.y0 = endPosition.y;
    });
  }

  initClickListeners() {
    document.querySelector('.size_buttons').addEventListener('click', (event) => {
      const selector = 'size_buttons-item--active';
      document.querySelector(`.${selector}`).classList.remove(selector);
      this.resizeCanvas(event.target.getAttribute('value'));
      event.target.classList.add(selector);
    });
  }

  resizeCanvas(size) {
    const imagePromises = [];
    document.querySelectorAll('.canvas-frames-holder > .canvas').forEach((el) => {
      const oldCanvas = el.toDataURL('image/png');
      const imagePromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvasEl = el;
          canvasEl.width = size;
          canvasEl.height = size;

          const startPosX = 0;
          const startPosY = 0;
          canvasEl.getContext('2d').drawImage(img, startPosX, startPosY);
          this.events.onChangeSize();
          resolve({ oldCanvas, status: 'ok' });
        };
        img.onerror = () => resolve({ oldCanvas, status: 'error' });
        img.src = oldCanvas;
      });
      imagePromises.push(imagePromise);
    });
    this.size = size;

    Promise.all(imagePromises).then(() => this.events.onChangeSize(size));
  }

  hide(el) {
    el.classList.add(this.hideSelector);
  }

  show(el) {
    document.querySelectorAll('.canvas').forEach((canvasEl) => canvasEl.classList.add('canvas-hide'));
    el.classList.remove(this.hideSelector);
  }
}
