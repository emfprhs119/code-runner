import { window as neuWindow, os } from '@neutralinojs/lib';

let dragging = false,
  ratio = 1,
  posX = 0,
  posY = 0,
  lastScreenX = 0,
  lastScreenY = 0,
  intervalId: number | null | NodeJS.Timeout,
  dragInterval = false,
  ratioUpdateForInterval = 0;

export const setDraggableRegion = async (draggable: HTMLElement) => {
  draggable!.onmousedown = async function (e) {
    let commandOut = await os.execCommand('DpiChecker', { cwd: 'third_party' });
    if (commandOut.stdOut) {
      ratio = parseInt(commandOut.stdOut) / 96;
    } else {
      ratio = window.devicePixelRatio;
    }
    const borderless = true;
    (posX = (e.pageX + 7) * ratio), (posY = (e.pageY + (borderless ? 7 : 25 + 5)) * ratio);
    dragging = true;

    intervalId = setInterval(() => {
      if (ratioUpdateForInterval > 400) {
        os.execCommand('DpiChecker', { cwd: 'third_party' }).then((commandOut) => {
          const dpr = parseInt(commandOut.stdOut) / 96;
          if (dpr != ratio) {
            ratio = dpr;
            neuWindow.move(lastScreenX * ratio - posX, lastScreenY * ratio - posY);
          }
          ratioUpdateForInterval = 0;
        });
      }
      dragInterval = true;
      ratioUpdateForInterval += 20;
    }, 20);
  };
  const endDrag = function () {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    dragging = false;
  };
  window.onmouseup = endDrag;

  document.onmousemove = function (e) {
    if (e.buttons !== 1) {
      endDrag();
    }
    lastScreenX = e.screenX;
    lastScreenY = e.screenY;
    if (dragging && dragInterval) {
      neuWindow.move(e.screenX * ratio - posX, e.screenY * ratio - posY);
    }
    dragInterval = false;
  };

  neuWindow.show();
  neuWindow.focus();
};
