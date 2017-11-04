import { Container, Graphics, Text } from 'pixi.js';
import Store from '../stores/Store';
import { Tween } from 'es6-tween';
import ScreenNumber from '../displayobjects/ScreenNumber/ScreenNumber'

const colors = [0x5C4B51, 0x8CBEB2, 0xF2EBBF, 0xF3B562, 0xF06060];

class LongScrollPage extends Container {
  constructor(color, number) {
    super();
    const { width, height } = Store.getState().Renderer;
    this.index = number;

    this.tween = new Tween(this.position);
    this.bg = new Graphics().beginFill(color).drawRect(0,0, width, height);
    this.number = new ScreenNumber(number + 1);
    this.bg.alpha = 1;
    this.addChild(this.bg, this.number);

  }

  enter(direction) {
    if(direction == 'down') {
    }
    this.visible = true;
  }

  exit(direction) {
    this.visible = false;
  }

  update(scrollY) {
    this.position.y = (this.index * this.bg.height) - scrollY;
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
    // add loaders
    for (let index = 0; index < this.totalScreens; index++) {
      const e = new LongScrollPage(colors[index], index);
      const { height } = Store.getState().Renderer;
      this.addChild(e);
      e.position.y = height * index;
    }
  }

  update(scrollData) {
    this.children.forEach( child => child.update(scrollData.scrollY) );
  }

  resize(width, height) {
    this.children.forEach( child => child.resize(width, height) );
  }
}


















class LongScrollBack extends Container {

  constructor(color, number) {
    super();
    const { width, height } = Store.getState().Renderer;
    this.index = number;

    this.tween = new Tween(this.position);
    this.bg = new Graphics().beginFill(color).drawRect(0,0, width, height);
    this.onScreenText = new Text('UNINIT', {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, align: 'center'});
    this.percentText = new Text('%', {fontFamily: 'Arial', fontSize: 18, fill: 0xFFFFFF, align: 'right'})
    this.bg.alpha = 0;
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
    const targetY = this.index * height;
    this.resize(width, height);
    this.checkAnimations(targetY, scrollY, scrollDelta);
  }

  checkAnimations(targetY, scrollY, delta) {
    const top = targetY;
    const bottom = top + this.height;
    const percentScroll = Math.round(Math.abs(((bottom - scrollY) / this.height) - 1) * 100);
    const onScreen = scrollY >= top && scrollY <= bottom;
    const nearScreen = scrollY >= top - NEARPAD && scrollY <= bottom - NEARPAD;
    const goingDown = delta < 0;

    // normal scroll
    // this.position.y = (this.index * this.height) - scrollY;

    // onscreen
    if(nearScreen) {
      this.onScreenText.text = `${this.index + 1} ONSCREEN`;
      if(!this.tween.isPlaying() && this.position.y !== 0) {
        this.position.y =this.height;
        this.tween.to({y: 0}, 300).start();
      }
    } else {
      this.onScreenText.text = `${this.index + 1} OFFSCREEN`;
      if(!this.tween.isPlaying() && this.position.y !== -this.height) {
        this.tween.to({y: -this.height}, 200).start()
      }
    }

    // // offscreen down
    // if(nearScreen && delta < 0 && scrollY > bottom) {
    //   console.log('scv')
    //   debounce(() => {debugger; console.log(this.index + 'offscreen down')}, 20)
      
    // }

    // // offscreen up
    // if(delta > 0 && scrollY < top) {
    //   //console.log(this.index + 'offscreen up')
    // }

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