import { Container, Graphics } from 'pixi.js';
import Store from '../stores/Store';
import ScreenNumber from '../displayobjects/ScreenNumber/ScreenNumber'

const colors = [0x071930, 0x023852, 0x03A694, 0xF24738, 0x851934];
const EXIT_ALPHA = 0.4;

class LongScrollPage extends Container {
  constructor(color, number = 0) {
    super();
    const { width, height } = Store.getState().Renderer;
    this.index = number;
    this.bgColor = color;
    this.bg = new Graphics().beginFill(color).drawRect(0,0, width, height);
    this.number = new ScreenNumber(number + 1);
    this.addChild(this.bg, this.number);
  }

  enterHandler(direction) {
  }

  exitHandler(direction) {
  }

  tickHandler(tick, prev) {
  }

  scrollHandler(currentPageScrolled) {
    this.number.update(currentPageScrolled);
  }

  resize(width, height) {
    const w = width - 300;
    this.number.position.x = (w / 2) + 300 - 200;
    this.number.position.y = height / 2 - 200;
    this.bg.clear().beginFill(this.bgColor).drawRect(0,0, width, height);
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
      e.ease = height;
    }
    this.children[0].position.y = 0;
    this.children[0].targetY = 0;
    this.children[0].ease = 0;

    Store.subscribe( ()=>{
      const { tick, previousTick } = Store.getState().Animation;
      if(tick !== previousTick) {
        this.children.forEach( child => {
          const speed = child.targetY === 0 ? 0.1 : 0.03;
          child.ease += (child.targetY - child.ease) * speed;
          child.position.y = child.ease;
          if(child.tickHandler) { child.tickHandler(tick, previousTick) }
        })
      }
    });
  }

  update(scrollData) {
    const { currentPage, currentPageScrolled, clientHeight, direction } = scrollData;
    const currentChild = this.children[currentPage];

    if(!this.children.length) return;

    if(currentChild.targetY !== 0) {
      currentChild.alpha = 1;
      if(currentChild.enterHandler) currentChild.enterHandler(direction);
    }

    // update all
    this.children.forEach( (child, i) => {
      if(i < currentPage) {
        if(child.targetY === 0) {
          child.alpha = EXIT_ALPHA;
          if(child.exitHandler) child.exitHandler(direction);
        }
        child.targetY = -clientHeight;
      }

      if(i > currentPage) {
        if(child.targetY === 0) {
          if(child.exitHandler) child.exitHandler(direction);
        }
        child.targetY = clientHeight;
      }

      if(i === currentPage) {
        child.targetY = 0;
      }
    } );

    if(currentChild.scrollHandler) currentChild.scrollHandler(currentPageScrolled);
  }

  resize(width, height) {
    this.children.forEach( child => child.resize && (child.resize(width, height)) );
  }
}
