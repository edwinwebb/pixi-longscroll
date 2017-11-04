/**
 * App.js
 *
 * The main entry point
 * -> appends PIXI to the DOM
 * -> starts a render and animation loop
 *
 */

import './index.html';
import { totalScreens } from './constants/AppConstants';
import { Container } from 'pixi.js';
import Renderer from './Renderer/Renderer';
import Store from './stores/Store';
import { ScrollStore } from './stores/Store';
import * as TWEEN from 'es6-tween';
import Loader from './screens/Loader';
import LongScroll from './screens/LongScroll';
import SideBar from './displayobjects/SideBar/SideBar';

import BG from './displayobjects/Background/diagnostic.png';
import SEEDS from './displayobjects/Background/millet.jpg';

const renderer = new Renderer({
  resolution: window.devicePixelRatio,
  backgroundColor: 0x000000
});
const app = new Container();
const loader = new Loader();
const sideBar = new SideBar();
const longScroll = new LongScroll(totalScreens);
const wrapper = document.body;
let previousSize = {
  x: 0,
  y: 0
}

// append
wrapper.appendChild(renderer.view);

// animate loop for tween
Store.subscribe( ()=>{
  const { tick, previousTick } = Store.getState().Animation;
  const { height, width } = Store.getState().Renderer;
  if(tick !== previousTick) {
    TWEEN.update();
  }
  if(width !== previousSize.x || height !== previousSize.y) {
    longScroll.resize(width, height);
  }
  previousSize.x = width;
  previousSize.y = height;
});

// update Scroller Store
window.addEventListener('scroll', ()=>{
  ScrollStore.dispatch({type: 'SCROLL.TICK'});
});

ScrollStore.subscribe( ()=>{
  const scroll = ScrollStore.getState();
  sideBar.update(scroll)
  longScroll.update(scroll);
});

// add loader and begin
app.addChild(loader);
loader.start([BG, SEEDS]); // TODO - remove

// remove loader then show example once complete
loader.onLoaded( ()=>{
  app.removeChild(loader);
  // rejig screen
  document.documentElement.classList.remove('loading');
  document.documentElement.classList.add('loaded');
  wrapper.style.height = `${100 * totalScreens}%`;

  ScrollStore.dispatch({type: 'SCROLL.TICK'});
  app.addChild(longScroll);
  app.addChild(sideBar);
  longScroll.addScreens();
  Store.dispatch({type: 'RENDERER.RESIZE'});
} );

// start the render loop
renderer.addRenderable(app);
renderer.start();

