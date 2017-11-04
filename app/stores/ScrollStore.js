import { totalScreens } from '../constants/AppConstants';

const defaultState = {
  scrollY: 0,
  direction: 'static',
  clientHeight: document.documentElement.clientHeight,
  delta: 0,
  targetSlide: 0,
  totalScreens
}

// TODO: I've added scroll pos here but it should be somewhere else
export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'SCROLL.TICK':
        const { scrollY } = window;
        const { clientHeight } = document.documentElement;
        const delta = state.scrollY - scrollY;
        const totalHeight = clientHeight * totalScreens;
        const currentPage = Math.floor(scrollY / clientHeight);
        const pageAbove = currentPage - 1;
        const pageBelow = currentPage + 1;
        const totalScrolled = scrollY / (clientHeight * (totalScreens - 1)) ;
        const currentPageScrolled = (scrollY - currentPage * clientHeight) / clientHeight;
        
        return {
          ...state,
          delta,
          scrollY,
          direction: delta > 0 ? 'up' : 'down',
          clientHeight,
          pageHeight: clientHeight,
          totalHeight,
          totalPages: totalScreens,
          totalScrolled,
          currentPage,
          currentPageScrolled,
          pageAbove,
          pageBelow
        }
      break;
    case 'SCROLL.GOTO':
      return {
        ...state,
        targetSlide: 0
      }
    break;
    default:
        return state;
      break;
  }
}