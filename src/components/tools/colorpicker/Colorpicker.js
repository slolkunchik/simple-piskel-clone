import template from './view/template';

export default class Colorpicker {
  constructor(color) {
    this.color = color;
    this.canvasSize = 512;
    this.updateColorDom();
    this.template = template;
  }

  render() {
    document.querySelector('.panel').insertAdjacentHTML('beforeend', this.template);
  }

  onMouseDown(startPosition, endPosition, ctx, size) {
    const { x } = endPosition;
    const { y } = endPosition;
    const pixelSize = 1;
    const rgbSize = 255;
    const imageData = ctx.getImageData(
      Math.floor(x / this.getScale(size)),
      Math.floor(y / this.getScale(size)),
      pixelSize,
      pixelSize,
    ).data;

    function rgbToHex(red, green, blue) {
      const hexRedRadix = 16;
      const hexGreenRadix = 8;
      const hexRadix = 16;

      if (red > rgbSize || green > rgbSize || blue > rgbSize) {
        throw new Error('Invalid color component');
      }
      // eslint-disable-next-line no-bitwise
      return ((red << hexRedRadix) | (green << hexGreenRadix) | blue).toString(hexRadix);
    }

    const redChanelIndex = 0;
    const greenChanelIndex = 1;
    const blueChanelIndex = 2;
    const defaultHexColor = '000000';
    const defaultHexLength = 6;

    const hex = `#${(defaultHexColor
        + rgbToHex(
          imageData[redChanelIndex],
          imageData[greenChanelIndex],
          imageData[blueChanelIndex],
        ))
      .slice(-defaultHexLength)}`;

    this.fill(hex, 'primary-color');
    this.updateColorDom();
  }

  getScale(size) {
    return Math.floor(this.canvasSize / size);
  }

  fill(color, inputId) {
    if (inputId === 'secondary-color') {
      this.color.secondaryValue = color;
    }
    if (inputId === 'primary-color') {
      this.color.value = color;
    }
  }

  swapColor() {
    const secondary = this.color.secondaryValue;
    this.color.secondaryValue = this.color.value;
    this.color.value = secondary;
  }

  updateColorDom() {
    document.getElementById('primary-color').value = this.color.value;
    document.getElementById('secondary-color').value = this.color.secondaryValue;
  }
}
