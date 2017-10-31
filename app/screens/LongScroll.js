import { Container, Graphics } from 'pixi.js';
import Store from '../stores/Store';

export default class LongScroll extends Container {

  constructor(color, number) {
    super();
    const { canvasWidth, canvasHeight } = Store.getState().Renderer; 

    console.log(canvasWidth, canvasHeight)

    this.bg = new Graphics().beginFill(color).drawRect(0,0,canvasWidth, canvasHeight);

    this.addChild(this.bg);

  }

  // page is visible
  enter() {}

  // page is invisile
  exit() {}

  // page gets update on v-pos
  update(position) {}

  // resize handler 
  resize() {}

}