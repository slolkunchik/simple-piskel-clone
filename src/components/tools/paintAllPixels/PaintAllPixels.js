import template from './view/template';

export default class PaintAllPixels {
  constructor(color) {
    this.color = color;
    this.canvasSize = 512;
    this.lock = false;
    this.template = template;
  }

  render() {
    document.querySelector('.panel').insertAdjacentHTML('beforeend', this.template);
  }

  onMouseDown(startPosition, endPosition, ctx, size) {
    const inputPos = endPosition;
    const { x } = endPosition;
    const { y } = endPosition;
    const redChanelIndex = 0;
    const greenChanelIndex = 1;
    const blueChanelIndex = 2;
    const alphaChanelIndex = 3;
    const rgbSize = 255;
    const pixelSize = 1;
    const imageData = ctx.getImageData(
      Math.floor(x / this.getScale(size)),
      Math.floor(y / this.getScale(size)),
      pixelSize,
      pixelSize,
    ).data;
    const originalRGBA = `rgba(${imageData[redChanelIndex]}, ${imageData[greenChanelIndex]
    }, ${imageData[blueChanelIndex]}, ${imageData[alphaChanelIndex] / rgbSize})`;

    ctx.fillStyle = this.color.value;

    if (this.lock) {
      return;
    }
    this.lock = true;
    inputPos.x = Math.floor(inputPos.x / this.getScale(size));
    inputPos.y = Math.floor(inputPos.y / this.getScale(size));

    let pixel;
    let data;
    let rgba;
    for (let xCoords = 0; xCoords < this.canvasSize; xCoords += 1) {
      for (let yCoords = 0; yCoords < this.canvasSize; yCoords += 1) {
        pixel = ctx.getImageData(xCoords, yCoords, pixelSize, pixelSize);
        data = pixel.data;
        rgba = `rgba(${data[redChanelIndex]}, ${data[greenChanelIndex]
        }, ${data[blueChanelIndex]}, ${data[alphaChanelIndex] / rgbSize})`;

        if (rgba === originalRGBA) {
          ctx.fillRect(xCoords, yCoords, pixelSize, pixelSize);
        }
      }
    }
    this.lock = false;
  }

  getScale(size) {
    return Math.floor(this.canvasSize / size);
  }
}
