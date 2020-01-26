import template from './view/template';

export default class Pencil {
  constructor(color, pencilSize) {
    this.canvasSize = 512;
    this.isDrawing = false;
    this.color = color;
    this.pencilSize = pencilSize;
    this.template = template;
  }

  render() {
    document.querySelector('.panel').insertAdjacentHTML('beforeend', this.template);
  }

  onMouseDown(startPosition, endPosition, ctx, size) {
    this.isDrawing = true;
    this.draw(endPosition, endPosition, ctx, size);
  }

  onMouseMove(startPosition, endPosition, ctx, size) {
    this.draw(startPosition, endPosition, ctx, size);
  }

  onMouseUp() {
    this.isDrawing = false;
  }

  draw(startPosition, endPosition, ctx, size) {
    ctx.fillStyle = this.color.value;
    const x = Math.floor(startPosition.x / this.getScale(size));
    const y = Math.floor(startPosition.y / this.getScale(size));
    if (this.isDrawing) {
      this.line(
        x,
        y,
        Math.floor(endPosition.x / this.getScale(size)),
        Math.floor(endPosition.y / this.getScale(size)),
        ctx,
      );
    }
  }

  line(x0, y0, x1, y1, ctx) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    let x0var = x0;
    let y0var = y0;

    for (;;) {
      this.fillRect(ctx, x0var, y0var);

      if ((x0var === x1) && (y0var === y1)) break;
      const e2 = 2 * this.pencilSize.value * err;
      if (e2 > -dy) {
        err -= dy;
        x0var += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0var += sy;
      }
    }
  }

  fillRect(ctx, x0var, y0var) {
    ctx.fillRect(x0var, y0var, this.pencilSize.value, this.pencilSize.value);
  }

  getScale(size) {
    return Math.floor(this.canvasSize / size);
  }

  changePencilSize(size) {
    this.pencilSize.value = size;
  }
}
