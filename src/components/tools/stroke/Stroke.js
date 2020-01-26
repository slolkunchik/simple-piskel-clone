import Pencil from '../pencil/Pencil';
import template from './view/template';

export default class Stroke extends Pencil {
  constructor(color, pencilSize) {
    super(color, pencilSize);
    this.template = template;
  }

  render() {
    document.querySelector('.panel').insertAdjacentHTML('beforeend', this.template);
  }

  draw(startPosition, endPosition, ctx, size) {
    ctx.strokeStyle = this.color.value;
    const x = Math.floor(startPosition.x / this.getScale(size));
    const y = Math.floor(startPosition.y / this.getScale(size));
    if (this.isDrawing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        Math.floor(endPosition.x / this.getScale(size)),
        Math.floor(endPosition.y / this.getScale(size)),
      );
      ctx.lineWidth = this.pencilSize.value;
      ctx.stroke();
      ctx.closePath();
    }
  }

  onMouseDown(startPosition, endPosition, ctx, size) {
    this.isDrawing = true;
    this.draw(endPosition, endPosition, ctx, size);
  }

  // eslint-disable-next-line no-unused-vars,class-methods-use-this
  onMouseMove(startPosition, endPosition, ctx, size) {
  }

  onMouseUp(startPosition, endPosition, ctx, size) {
    this.draw(startPosition, endPosition, ctx, size);
    this.isDrawing = false;
  }
}
