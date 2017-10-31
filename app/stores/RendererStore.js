import { canvasWidth, canvasHeight } from '../constants/AppConstants';

const windowSize = () => ({
  width: document.body.clientWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
  stageCenter: {x: document.body.clientWidth / 2, y: window.innerHeight / 2}
});

const defaultState = {
  canvasHeight,
  canvasWidth,
  canvasCenter: {
    x: canvasWidth / 2,
    y: canvasHeight / 2
  },
  ...windowSize()
};

export const RESIZE = 'RENDERER.RESIZE';

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case RESIZE:
        return {
          ...state,
          ...windowSize()
        }
      break;
    default:
        return state;
      break;
  }
}