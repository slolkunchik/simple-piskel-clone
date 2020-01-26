import Pencil from '../pencil/Pencil';
import template from './view/template';

export default class Eraser extends Pencil {
  constructor(color, pencilSize) {
    super(color, pencilSize);
    this.template = template;
  }

  render() {
    document.querySelector('.panel').insertAdjacentHTML('beforeend', this.template);
  }

  fillRect(ctx, x0var, y0var) {
    ctx.clearRect(x0var, y0var, this.pencilSize.value, this.pencilSize.value);
  }
}
