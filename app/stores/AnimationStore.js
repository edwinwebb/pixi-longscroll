const defaultState = {
  tick: 1,
  previousTick: 0,
  startTime: window.performance.now(),
  currentTime: window.performance.now(),
  scrollY: 0
}


// TODO: I've added scroll pos here but it should be somewhere else
export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'ANIMATION.TICK':
        return {
          ...state,
          tick: state.tick + 1,
          previousTick: state.tick,
          currentTime: window.performance.now(),
          scrollY: window.scrollY,
          scrollDelta: state.scrollY + window.scrollY
        }
      break;
    default:
        return state;
      break;
  }
}