import { Container, Graphics, Text } from 'pixi.js';
import Store from '../stores/Store';

export default class LongScroll extends Container {

  constructor(color, number) {
    super();
    const { width, height } = Store.getState().Renderer;
    this.index = number;

    this.bg = new Graphics().beginFill(color).drawRect(0,0, width, height);
    this.bg.alpha = 0.1;
    this.onScreenText = new Text('UNINIT', {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, align: 'center'});
    this.percentText = new Text('%', {fontFamily: 'Arial', fontSize: 18, fill: 0xFFFFFF, align: 'right'})

    this.addChild(this.bg, this.onScreenText, this.percentText);

  }

  // page is visible
  enter(down = true) {
    console.log(`VISIBLE: ${this.index}`);
  }

  // page is invisile
  exit(down = true) {
    console.log(`INVISIBLE: ${this.index}`);
  }

  // page gets update on v-pos
  update(scrollY, scrollDelta, width, height) {
    this.resize(width, height);
    this.position.y = (this.index * height) - scrollY;
    this.checkAnimations(scrollY, scrollDelta);
  }

  checkAnimations(scrollY, scrollDelta) {
    const originalY = this.index * this.height;
    const top = originalY;
    const bottom = top + this.height;
    const percentScroll = Math.round(Math.abs(((bottom - scrollY) / this.height) - 1) * 100);

    // onscreen
    if(scrollY >= top && scrollY <= bottom) {
      this.onScreenText.text = 'ONSCREEN';
    } else {
      this.onScreenText.text = 'OFFSCREEN';
    }

    // percent
    this.percentText.text =  `Screen Progress: ${percentScroll}%`;
  }

  // resize handler
  resize(width, height) {
    if(width !== this.width || height !== this.height) {
      this.bg.width = width;
      this.bg.height = height;
    }

    this.onScreenText.position.x = width / 2;
    this.onScreenText.position.y = height / 2;

    this.percentText.position.x = width - this.percentText.width - 44;
    this.percentText.position.y = height - 44;
  }

}