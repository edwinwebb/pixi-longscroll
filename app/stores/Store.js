import { createStore, combineReducers } from 'redux'
import Animation from './AnimationStore';
import Renderer from './RendererStore';
import Scroll from './ScrollStore';

const Combi = combineReducers({
  Animation,
  Renderer
});

export default createStore(Combi)

export const ScrollStore = createStore(Scroll);
