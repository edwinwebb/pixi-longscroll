import { Container, Graphics, Text } from 'pixi.js';
import Store from '../stores/Store';
import { Tween } from 'es6-tween';

function debounce(fn, wait) {
  let timeout=null;
  const c=()=>{ clearTimeout(timeout); timeout=null; };
  const t=fn=>{ timeout=setTimeout(fn,wait); };
  return ()=>{
      const context=this;
      const args=arguments;
      let f=()=>{ fn.apply(context,args); };
      timeout
          ? c()||t(f)
          : t(c)||f();
  }
}

const NEARPAD = 100;

export default class LongScroll extends Container {

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
    const goingDown = this.detla < 0;

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