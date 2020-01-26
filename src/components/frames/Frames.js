import './style/style.css';
import template from './view/template';
import frameTemplate from './view/frame-template';

export default class Frames {
  constructor(events) {
    this.frameNumber = 0;
    this.activeFrameNumber = 0;
    this.frames = [];
    this.events = events;
    this.parseIntRadix = 10;
    this.template = template;
    this.updateSequenceSelector = '.frames_box-frames > .frame';
  }

  init() {
    this.render(true);
    this.renderButton();
    this.initClickListeners();
    this.initKeyListeners();
    this.frames[this.activeFrameNumber] = {
      canvas: document.querySelector('.canvas'),
      frame: document.querySelector(`[data-number="${this.activeFrameNumber}"]`).firstElementChild,
    };
    this.frames[this.activeFrameNumber].frame.src = this.frames[this.activeFrameNumber]
      .canvas.toDataURL();
    this.onFrameChange();
    this.initDragAndDrop();
  }

  render(isAddCssClass, prevNumber) {
    let activeCssClass = '';
    function parse(string, params) {
      return Object.keys(params).reduce((acc, rec) => acc.replace(`#${rec}#`, params[rec]), string);
    }
    const el = document.querySelector('.frames_box-frames');

    if (isAddCssClass) {
      activeCssClass = 'frame-active';
    }

    if (prevNumber !== undefined) {
      document.querySelector(`[data-number="${prevNumber}"]`)
        .insertAdjacentHTML(
          'afterend',
          parse(frameTemplate, { frameNumber: prevNumber + 1, activeCssClass }),
        );
      this.updateSequence();
    } else {
      el.insertAdjacentHTML(
        'beforeend',
        parse(frameTemplate, { frameNumber: this.frameNumber, activeCssClass }),
      );
    }
  }

  renderButton() {
    const el = document.querySelector('.frames_box');
    el.insertAdjacentHTML('beforeend', this.template);
  }

  draw(canvas, add) {
    const frame = document.querySelector(`[data-number="${this.activeFrameNumber}"]`).firstElementChild;
    const deleteFrameCount = 0;
    if (add) {
      this.frames.splice(
        this.activeFrameNumber,
        deleteFrameCount,
        {
          canvas,
          frame,
        },
      );
    } else {
      this.frames[this.activeFrameNumber] = {
        canvas,
        frame,
      };
    }

    this.frames[this.activeFrameNumber].frame.src = canvas.toDataURL();
    this.onFrameChange();
  }

  initClickListeners() {
    document.querySelector('.frame_button').addEventListener('click', () => {
      this.addFrame();
    });
    document.querySelector('.frames_box-frames').addEventListener('click', (event) => {
      const closestDeleteButton = event.target.closest('.frame-delete');
      const closestCopyButton = event.target.closest('.frame-copy');
      const closestFrame = event.target.closest('.frame');
      if (closestDeleteButton) {
        this.deleteFrame(parseInt(closestDeleteButton.closest('.frame').dataset.number, this.parseIntRadix));
      } else if (closestCopyButton) {
        this.onFrameCopy(parseInt(closestCopyButton.closest('.frame').dataset.number, this.parseIntRadix));
      } else if (closestFrame) {
        document.querySelectorAll('.frame-active')
          .forEach((frameEl) => frameEl.classList.remove('frame-active'));
        closestFrame.classList.add('frame-active');
        this.activeFrameNumber = parseInt(closestFrame.dataset.number, this.parseIntRadix);
        this.events.onFrameSelect(this.frames[this.activeFrameNumber].canvas);
      }
    });
    document.querySelector('.frames_box-frames').addEventListener('mouseover', (event) => {
      const closestFrame = event.target.closest('.frame');
      if (closestFrame) {
        closestFrame.classList.add('hoverForKey');
      }
    });
    document.querySelector('.frames_box-frames').addEventListener('mouseout', () => {
      const hoverEl = document.querySelector('.hoverForKey');
      if (hoverEl) {
        hoverEl.classList.remove('hoverForKey');
      }
    });
  }

  initKeyListeners() {
    document.addEventListener('keyup', (event) => {
      const hoveredFrame = document.querySelector('.hoverForKey');
      if (!hoveredFrame) {
        return;
      }
      const { code } = event;
      switch (code) {
        case 'KeyF':
          this.addFrame();
          break;
        case 'Minus':
          this.deleteFrame(parseInt(hoveredFrame.dataset.number, this.parseIntRadix));
          break;
        case 'KeyC':
          this.onFrameCopy(parseInt(hoveredFrame.dataset.number, this.parseIntRadix));
          break;
        default:
          break;
      }
    });
  }

  initDragAndDrop() {
    const self = this;
    const spliceNoDelete = 0;
    const spliceOneDelete = 1;
    $(() => {
      $('.frames_box-frames').sortable({
        stop(event, ui) {
          const elementIndex = ui.item.data('number');
          const newIndex = Array.from(document.querySelectorAll('.frames_box-frames > .frame'))
            .findIndex((el) => parseInt(
              el.dataset.number,
              self.parseIntRadix,
            ) === parseInt(
              elementIndex,
              self.parseIntRadix,
            ));
          self.updateSequence();

          const frameElement = self.frames.splice(elementIndex, spliceOneDelete);
          self.frames.splice(newIndex, spliceNoDelete, frameElement.pop());
          self.onFrameChange();
        },
      });
      $('.frames_box-frames').disableSelection();
    });
  }

  addFrame() {
    this.frameNumber += 1;
    this.activeFrameNumber = this.frameNumber;
    this.events.onFrameCreate(this.frameNumber, (canvas) => {
      document.querySelectorAll('.frame-active')
        .forEach((frameEl) => frameEl.classList.remove('frame-active'));
      this.render(true);
      this.draw(canvas);
    });
  }

  deleteFrame(deleteNumber) {
    const indexToDelete = parseInt(deleteNumber, this.parseIntRadix);

    if (this.frames.length <= 1) {
      return;
    }
    this.frameNumber -= 1;
    this.frames[indexToDelete].frame.parentElement.remove();
    this.frames[indexToDelete].canvas.remove();

    let selectIndex = this.activeFrameNumber;
    if (this.activeFrameNumber === indexToDelete) {
      if (indexToDelete === 0 && this.frames.length > 1) {
        this.activeFrameNumber += 1;
      }
      if (indexToDelete > 0) {
        this.activeFrameNumber = indexToDelete - 1;
      }
      selectIndex = this.activeFrameNumber;
    } else if (this.activeFrameNumber > indexToDelete) {
      selectIndex = this.activeFrameNumber;
      this.activeFrameNumber -= 1;
    }

    document.querySelectorAll('.frame-active')
      .forEach((frameEl) => frameEl.classList.remove('frame-active'));

    this.frames[selectIndex].frame.parentElement.classList.add('frame-active');
    this.events.onFrameSelect(this.frames[selectIndex].canvas);

    this.updateSequence();
    const numberOfElementsToDelete = 1;
    this.frames.splice(indexToDelete, numberOfElementsToDelete);
    this.onFrameChange();
  }

  updateSequence() {
    let index = 0;
    document.querySelectorAll(this.updateSequenceSelector)
      .forEach((frameEl) => {
        const frame = frameEl;
        frame.dataset.number = index;
        index += 1;
      });
  }

  onResize() {
    this.frames.map((el) => {
      const frameObj = el;
      frameObj.frame.src = frameObj.canvas.toDataURL();
      return undefined;
    });

    this.onFrameChange();
  }

  onFrameChange() {
    const images = this.frames.map((el) => ({
      big: el.canvas.toDataURL(),
    }));

    this.events.onFrameChange(images);
  }

  onFrameCopy(number) {
    this.frameNumber += 1;
    this.activeFrameNumber = number + 1;
    this.events.onFrameCopy(number, this.frames[number].canvas, (canvas) => {
      document.querySelectorAll('.frame-active')
        .forEach((frameEl) => frameEl.classList.remove('frame-active'));
      this.render(true, number);
      this.draw(canvas, true);
    });
  }
}
