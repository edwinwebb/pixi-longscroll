/**
 * Counter for each longscroller
 *
 * @exports ScreenNumber
 * @extends Container
 */

import { Container, Graphics, Text } from 'pixi.js';

const size = 200;

export default class ScreenNumber extends Container {

  constructor(index) {
    super();

    this.bg = new Graphics().lineStyle(20, 0x000000, 0.4).arc(size, size, size, -Math.PI / 2, Math.PI * 1.501, false);
    this.progress = new Graphics();
    this.number = new Text(index, {textAlign: 'center', fontSize: size * 1.5, fill: 0xFEFEFE, fontFamily: 'Arial'});
    this.number.position.x = size * 0.5;
    this.number.position.y = size * 0.25;
    this.addChild(this.bg, this.progress, this.number);
  }
  
  update(progress) {
    this.progress.clear().lineStyle(20, 0xFFFFFF, 1).arc(size, size, size, -Math.PI / 2, (progress * (Math.PI * 2.01))-Math.PI / 2);
  }
  
}
