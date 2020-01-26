import './images/favicon.ico';
import Canvas from '../components/canvas/Canvas';
import Toolset from '../components/tools/Toolset';
import Frames from '../components/frames/Frames';
import Preview from '../components/preview/Preview';
import GoogleAuth from '../components/googleAuth/GoogleAuth';
import Export from '../components/export/Export';


export default class State {
  constructor() {
    this.defaultCanvasSize = 512;
  }

  init() {
    this.toolset = new Toolset();
    this.toolset.init();
    this.canvas = new Canvas({
      onMouseDown: this.onMouseDown.bind(this),
      onMouseMove: this.onMouseMove.bind(this),
      onMouseUp: this.onMouseUp.bind(this),
      onChangeSize: this.onChangeSize.bind(this),
    },
    this.defaultCanvasSize);
    this.canvas.init();
    this.preview = new Preview({
      onRangeInput: this.onRangeInput.bind(this),
    });
    this.preview.init();
    this.frames = new Frames({
      onFrameCreate: this.onFrameCreate.bind(this),
      onFrameSelect: this.onFrameSelect.bind(this),
      onFrameChange: this.onFrameChange.bind(this),
      onFrameCopy: this.onFrameCopy.bind(this),
    });
    this.frames.init();
    this.googleAuth = new GoogleAuth();
    this.googleAuth.init();
    this.export = new Export({
      onExportClick: this.onExportClick.bind(this),
    });
    this.export.init();
  }

  onMouseDown(startPosition, endPosition, canvas, size) {
    this.toolset.onMouseDown(startPosition, endPosition, canvas.getContext('2d'), size);
  }

  onMouseMove(startPosition, endPosition, canvas, size) {
    this.toolset.onMouseMove(startPosition, endPosition, canvas.getContext('2d'), size);
  }

  onMouseUp(startPosition, endPosition, canvas, size) {
    this.toolset.onMouseUp(startPosition, endPosition, canvas.getContext('2d'), size);
    this.frames.draw(canvas);
  }

  onFrameCreate(frameNumber, callback) {
    this.canvas = new Canvas({
      onMouseDown: this.onMouseDown.bind(this),
      onMouseMove: this.onMouseMove.bind(this),
      onMouseUp: this.onMouseUp.bind(this),
    },
    this.canvas.size);
    this.canvas.addCanvas(frameNumber);
    callback(this.canvas.activeCanvas);
  }

  onFrameSelect(activeCanvas) {
    this.canvas.show(activeCanvas);
  }

  onFrameChange(images) {
    this.framesForAnimation = images;
    this.preview.animate(images);
  }

  onRangeInput() {
    this.preview.animate(this.framesForAnimation);
  }

  onFrameCopy(frameNumber, canvas, callback) {
    this.canvas = new Canvas({
      onMouseDown: this.onMouseDown.bind(this),
      onMouseMove: this.onMouseMove.bind(this),
      onMouseUp: this.onMouseUp.bind(this),
    },
    this.defaultCanvasSize);

    this.canvas.copyCanvas(canvas, frameNumber);
    callback(this.canvas.activeCanvas);
  }

  onChangeSize(size) {
    this.defaultCanvasSize = size;
    this.frames.onResize();
  }

  onExportClick(callback) {
    const imagesArray = this.frames.frames.map((frame) => frame.canvas);
    const size = imagesArray[0].width;
    const delay = this.preview.timeoutTime;
    callback(imagesArray, size, delay);
  }
}
