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
import {ScrollStore} from './stores/Store';
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
const wrapper = document.body;
const colors = [0x5C4B51, 0x8CBEB2, 0xF2EBBF, 0xF3B562, 0xF06060];
const scrolls = [];

// append
wrapper.appendChild(renderer.view);

// animate loop for tween
Store.subscribe( ()=>{
  const { tick, previousTick, scrollY, scrollDelta } = Store.getState().Animation;
  const { height, width } = Store.getState().Renderer;
  if(tick !== previousTick) {
    TWEEN.update();
    scrolls.forEach( scroll => scroll.update(scrollY, scrollDelta, width, height) )
  }
});

// test out scroller store
window.addEventListener('scroll', ()=>{
  ScrollStore.dispatch({type: 'SCROLL.TICK'});
});

ScrollStore.subscribe( ()=>{
  const  Scroll  = ScrollStore.getState();
  // const { currentPage, totalHeight, totalPages, totalPercent, pageHeight, direction, scrollY } = Scroll;
  sideBar.update(Scroll)
});

// add loader and begin
app.addChild(loader);
loader.start([BG, SEEDS]);

// remove loader then show example once complete
loader.onLoaded( ()=>{
  app.removeChild(loader);
  // rejig screen
  document.documentElement.classList.remove('loading');
  document.documentElement.classList.add('loaded');
  wrapper.style.height = `${100 * totalScreens}%`;

  // add loaders
  for (let index = 0; index < totalScreens; index++) {
    const e = new LongScroll(colors[index], index);
    const { height } = Store.getState().Renderer;
    scrolls.push(e);
    app.addChild(e);
    e.position.y = height * index;
  }

  ScrollStore.dispatch({type: 'SCROLL.TICK'});
  app.addChild(sideBar);
} );

// start the render loop
renderer.addRenderable(app);
renderer.start();

