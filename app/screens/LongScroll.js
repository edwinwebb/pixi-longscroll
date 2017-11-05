import { Container, Graphics } from 'pixi.js';
import Store from '../stores/Store';
import { Tween } from 'es6-tween';
import ScreenNumber from '../displayobjects/ScreenNumber/ScreenNumber'

const colors = [0x071930, 0x023852, 0x03A694, 0xF24738, 0x851934];

class LongScrollPage extends Container {
  constructor(color, number = 0) {
    super();
    const { width, height } = Store.getState().Renderer;
    this.index = number;

    this.tween = new Tween(this);
    this.bg = new Graphics().beginFill(color).drawRect(0,0, width, height);
    this.number = new ScreenNumber(number + 1);
    this.bg.alpha = 1;
    this.addChild(this.bg, this.number);
    this.ease = 0;
    this.alpha = number === 0 ? 1 : 0.2;
  }

  enter() {
    this.tween.stop().to({alpha: 1}, 200).start();
  }

  exit() {
    this.tween.stop();
    this.alpha = 0.2;
  }

  update() {
    const speed = this.targetY === 0 ? 0.1 : 0.03;
    this.ease += (this.targetY - this.ease) * speed;
    this.position.y = this.ease;
  }

  resize(width, height) {
    const w = width - 300;
    this.number.position.x = (w / 2) + 300 - 200;
    this.number.position.y = height / 2 - 200;
  }
}

export default class LongScroll extends Container {
  constructor(totalScreens) {
    super();
    this.totalScreens = totalScreens;
  }

  addScreens() {
    const { height } = Store.getState().Renderer;
    for (let index = 0; index < this.totalScreens; index++) {
      const e = new LongScrollPage(colors[index % 5], index);
      this.addChild(e);
      e.position.y = height;
      e.targetY = height;
    }
    this.children[0].position.y = 0;
    this.children[0].targetY = 0;

    Store.subscribe( ()=>{
      const { tick, previousTick } = Store.getState().Animation;
      if(tick !== previousTick) {
        this.children.forEach( child => child.update())
      }
    });
  }

  update(scrollData) {
    const { currentPage, currentPageScrolled, clientHeight, direction } = scrollData;
    const currentChild = this.children[currentPage];

    if(!this.children.length) return;

    if(currentChild.targetY !== 0) {
      currentChild.enter(direction);
    }

    // update all
    this.children.forEach( (child, i) => {
      child.number.update(0);

      if(i < currentPage) {
        if(child.targetY === 0) child.exit(direction);
        child.targetY = -clientHeight;
      }

      if(i > currentPage) {
        if(child.targetY === 0) child.exit(direction);
        child.targetY = clientHeight;
      }

      if(i === currentPage) {
        child.targetY = 0;
      }
    } );

    currentChild.number.update(currentPageScrolled);
  }

  resize(width, height) {
    this.children.forEach( child => child.resize(width, height) );
  }
}
