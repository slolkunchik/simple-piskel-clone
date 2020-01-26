import './style/style.css';
import template from './view/template';

import Pencil from './pencil/Pencil';
import ColorPicker from './colorpicker/Colorpicker';
import Bucket from './bucket/Bucket';

import Eraser from './eraser/Eraser';
import Stroke from './stroke/Stroke';
import PaintAllPixels from './paintAllPixels/PaintAllPixels';

export default class Toolset {
  constructor() {
    this.activeTool = null;
    this.tools = {};
    const yellowColor = '#fff71f';
    const greenColor = '#317617';
    this.activeColor = { secondaryValue: yellowColor, value: greenColor };
    this.pencilSize = { value: 1 };
    this.template = template;
  }

  init() {
    this.render();
    this.tools = {
      pencil: new Pencil(this.activeColor, this.pencilSize),
      eraser: new Eraser(this.activeColor, this.pencilSize),
      colorPicker: new ColorPicker(this.activeColor),
      bucket: new Bucket(this.activeColor),
      stroke: new Stroke(this.activeColor, this.pencilSize),
      paintAllPixels: new PaintAllPixels(this.activeColor),
    };
    Object.keys(this.tools).forEach((toolKey) => this.tools[toolKey].render());
    this.setActiveTool('pencil');
    this.initClickListeners();
    this.initKeyListeners();
  }

  initClickListeners() {
    document.querySelectorAll('.tool_sizes_box-size').forEach((toolSize) => {
      toolSize.addEventListener('click', (event) => {
        document.querySelector('.tool_sizes_box-size--active')
          .classList.remove('tool_sizes_box-size--active');
        event.target.closest('.tool_sizes_box-size').classList.add('tool_sizes_box-size--active');
      });
    });
    document.querySelector('.tool_sizes_box').addEventListener('click', (event) => {
      const size = +event.target.closest('.tool_sizes_box-size').dataset.size;
      this.tools.pencil.changePencilSize(size);
    });
    document.querySelectorAll('.panel-tool').forEach((tool) => {
      tool.addEventListener('click', (event) => {
        document.querySelector('.panel-tool--active').classList.remove('panel-tool--active');
        this.setActiveTool(event.target.closest('button').dataset.tool);
        event.target.closest('button').classList.add('panel-tool--active');
      });
    });
    document.getElementById('swap').addEventListener('click', () => {
      this.tools.colorPicker.swapColor();
      this.tools.colorPicker.updateColorDom();
    });

    document.querySelector('.primary-color').addEventListener('change', (event) => {
      this.tools.colorPicker.fill(event.target.value, event.target.id);
    });

    document.querySelector('.secondary-color').addEventListener('change', (event) => {
      this.tools.colorPicker.fill(event.target.value, event.target.id);
    });
  }

  setActiveTool(toolKey) {
    this.activeTool = this.tools[toolKey];
  }

  onMouseDown(startPosition, endPosition, ctx, size) {
    if (typeof this.activeTool.onMouseDown === 'function') {
      this.activeTool.onMouseDown(startPosition, endPosition, ctx, size);
    }
  }

  onMouseMove(startPosition, endPosition, ctx, size) {
    if (typeof this.activeTool.onMouseMove === 'function') {
      this.activeTool.onMouseMove(startPosition, endPosition, ctx, size);
    }
  }

  onMouseUp(startPosition, endPosition, ctx, size) {
    if (typeof this.activeTool.onMouseUp === 'function') {
      this.activeTool.onMouseUp(startPosition, endPosition, ctx, size);
    }
  }

  render() {
    document.querySelector('.aside_container').insertAdjacentHTML('beforeend', this.template);
  }

  initKeyListeners() {
    const pencilEl = document.querySelector('[data-tool="pencil"]');
    const fillBucketEl = document.querySelector('[data-tool="bucket"]');
    const colorPickerEl = document.querySelector('[data-tool="colorPicker"]');
    const paintAllPixelsEl = document.querySelector('[data-tool="paintAllPixels"]');
    const eraserEl = document.querySelector('[data-tool="eraser"]');
    const strokeEl = document.querySelector('[data-tool="stroke"]');

    document.addEventListener('keyup', (event) => {
      const { code } = event;
      if (['KeyB', 'KeyP', 'KeyI', 'KeyS', 'KeyE', 'KeyA'].includes(code)) {
        const activeTool = document.querySelector('.panel-tool--active');
        if (activeTool) {
          activeTool.classList.remove('panel-tool--active');
        }
      }
      switch (code) {
        case 'KeyB':
          fillBucketEl.classList.add('panel-tool--active');
          this.setActiveTool('fillBucket');
          break;
        case 'KeyP':
          pencilEl.classList.add('panel-tool--active');
          this.setActiveTool('pencil');
          break;
        case 'KeyI':
          colorPickerEl.classList.add('panel-tool--active');
          this.setActiveTool('colorPicker');
          break;
        case 'KeyA':
          paintAllPixelsEl.classList.add('panel-tool--active');
          this.setActiveTool('paintAllPixels');
          break;
        case 'KeyE':
          eraserEl.classList.add('panel-tool--active');
          this.setActiveTool('eraser');
          break;
        case 'KeyS':
          strokeEl.classList.add('panel-tool--active');
          this.setActiveTool('stroke');
          break;
        default:
          break;
      }
    });
  }
}
