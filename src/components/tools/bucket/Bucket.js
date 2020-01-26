import template from './view/template';

export default class Bucket {
  constructor(color) {
    this.color = color;
    this.canvasSize = 512;
    this.template = template;
  }

  render() {
    document.querySelector('.panel').insertAdjacentHTML('beforeend', this.template);
  }

  onMouseDown(startPosition, endPosition, ctx, size) {
    const startPosX = 0;
    const startPosY = 0;
    const inputPos = endPosition;
    ctx.fillStyle = this.color.value;

    inputPos.x = Math.floor(inputPos.x / this.getScale(size));
    inputPos.y = Math.floor(inputPos.y / this.getScale(size));

    function forAllNeighbors(point, fn) {
      fn({ x: point.x, y: point.y + 1 });
      fn({ x: point.x, y: point.y - 1 });
      fn({ x: point.x + 1, y: point.y });
      fn({ x: point.x - 1, y: point.y });
    }
    function isSameColor(data, pos1, pos2) {
      const numberOfRGBAChannels = 4;
      const offset1 = (pos1.x + pos1.y * data.width) * numberOfRGBAChannels;
      const offset2 = (pos2.x + pos2.y * data.width) * numberOfRGBAChannels;
      for (let i = 0; i < numberOfRGBAChannels; i += 1) {
        if (data.data[offset1 + i] !== data.data[offset2 + i]) return false;
      }
      return true;
    }
    const data = ctx.getImageData(startPosX, startPosY, ctx.canvas.width, ctx.canvas.height);
    const alreadyFilled = new Array(data.width * data.height);
    const workList = [inputPos];
    while (workList.length) {
      const pos = workList.pop();
      const offset = pos.x + data.width * pos.y;
      if (!alreadyFilled[offset]) {
        const pixelSize = 1;
        ctx.fillRect(pos.x, pos.y, pixelSize, pixelSize);
        alreadyFilled[offset] = true;
        forAllNeighbors(pos, (neighbor) => {
          if (neighbor.x >= 0 && neighbor.x < data.width
              && neighbor.y >= 0 && neighbor.y < data.height
              && isSameColor(data, pos, neighbor)) workList.push(neighbor);
        });
      }
    }
  }

  getScale(size) {
    return Math.floor(this.canvasSize / size);
  }
}
