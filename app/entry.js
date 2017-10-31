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
import Renderer from './Renderer/Renderer';
import ScaledContainer from './displayobjects/ScaledContainer/ScaledContainer';
import Store from './stores/Store';
import * as TWEEN from 'es6-tween';
import Loader from './screens/Loader';
import LongScroll from './screens/LongScroll';

import BG from './displayobjects/Background/diagnostic.png';
import SEEDS from './displayobjects/Background/millet.jpg';

const renderer = new Renderer({
  resolution: window.devicePixelRatio
});
const app = new ScaledContainer();
const loader = new Loader();
const wrapper = document.querySelector('#wrapper');
const colors = [0x5C4B51, 0x8CBEB2, 0xF2EBBF, 0xF3B562, 0xF06060];

// append
wrapper.appendChild(renderer.view);

// animate loop for tween
Store.subscribe( ()=>{
  const { tick, previousTick } = Store.getState().Animation;
  if(tick !== previousTick) {
    TWEEN.update()
  }
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
  wrapper.style.height = `${window.innerHeight * totalScreens}px`;

  // add loaders
  for (let index = 0; index < totalScreens; index++) {
    const e = new LongScroll(colors[index]);
    const { height } = Store.getState().Renderer;
    app.addChild(e);
    e.position.y = height * index;
  }

} );

// start the render loop
renderer.addRenderable(app);
renderer.start();

