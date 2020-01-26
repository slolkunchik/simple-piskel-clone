import Frame from '../components/frames/Frames';
import Toolset from '../components/tools/Toolset';
import Pencil from "../components/tools/pencil/Pencil";
import Eraser from "../components/tools/eraser/Eraser";
import ColorPicker from "../components/tools/colorpicker/Colorpicker";
import Bucket from "../components/tools/bucket/Bucket";
import Stroke from "../components/tools/stroke/Stroke";
import PaintAllPixels from "../components/tools/paintAllPixels/PaintAllPixels";

test('Frames canvas -> base64 image conversion works fine', () => {
  let actual = '';
  const expected = [{ big: 'base64 value' }];
  const testframe = new Frame({onFrameChange: (images) => actual = images});
  testframe.frames = [{ canvas: { toDataURL: () => 'base64 value' } }];
  testframe.onFrameChange();
  expect(actual).toMatchObject(expected);
});

test('Toolset -> onMouseDown invoke onMouseDown event on active tool', () => {
  let actual = '';
  const expected = 'invoked';
  const testToolset = new Toolset();
  testToolset.tools = {
    pencil: { onMouseDown: (arg) => actual = arg },
    eraser: { onMouseDown: (arg) => actual = arg },
};
  testToolset.setActiveTool('eraser');
  testToolset.onMouseDown('invoked');
  expect(actual).toEqual(expected);
});
