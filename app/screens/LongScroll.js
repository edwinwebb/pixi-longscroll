import { Container, Graphics } from 'pixi.js';
import Store from '../stores/Store';

export default class LongScroll extends Container {

  constructor(color, number) {
    super();
    const { width, height } = Store.getState().Renderer;
    this.index = number;

    this.bg = new Graphics().beginFill(color).drawRect(0,0, width, height);

    this.addChild(this.bg);

  }

  // page is visible
  enter() {}

  // page is invisile
  exit() {}

  // page gets update on v-pos
  update(scrollY = 0, height = 800, width) {
    this.position.y = (this.index * height) - scrollY;
    if(width !== this.width || height !== this.height) {
      this.bg.width = width;
      this.bg.height = height;
    }
  }

  // resize handler
  resize() {

  }

}