/**
 * update
 *
 * @exports SideBar
 * @extends Container
 */

import { Container, Text, Graphics }  from 'pixi.js';

const defaultText = {fontFamily: 'Arial', fontSize: 18, fill: 0xFCFCFC, align: 'left'};
const width = 300;

export default class SideBar extends Container {

  constructor() {
    super();

    this.title = new Text('Pixi.js Longscroll', {...defaultText, align: 'center', fontSize: 24, color: 0xFFFFFF});
    this.totalPages = new Text('Total Pages: ', defaultText);
    this.totalPercent = new Text('Total Percent', defaultText);
    this.currentPage = new Text('Current Page', defaultText);
    this.currentPagePerc = new Text('%', defaultText);
    this.currentScroll = new Text('px', defaultText);
    this.totalPageHeight = new Text('px', defaultText);
    this.bgLine = new Graphics();
    this.currentLine = new Graphics();

    const others = [this.totalPages, this.currentPage, this.currentPagePerc, this.totalPageHeight, this.currentScroll, this.totalPercent];
    const offset = 40
    
    this.addChild(this.title, ...others, this.bgLine, this.currentLine);

    this.title.position.x = 20;
    this.title.position.y = 20;
    this.bgLine.position.x = 300;
    this.currentLine.position.x = 300;

    others.forEach( (other, i) => {
      other.position.set(20, i * 28 + offset + 20);
    });
  }
  
  update(scrolldata) {
    const { totalPages, totalScrolled, totalHeight, currentPage, currentPageScrolled , scrollY, clientHeight } = scrolldata;
    // text
    this.totalPages.text = `Total Pages: ${ totalPages }`;
    this.totalPercent.text = `Total Percent:  ${ Math.round(totalScrolled * 100) }%`;
    this.currentPage.text = `Current Page:  ${ currentPage + 1 }`;
    this.currentPagePerc.text = `Current Page Percent:  ${ Math.round(currentPageScrolled * 100) }%`;
    this.currentScroll.text = `Current Scroll:  ${ scrollY }px`;
    this.totalPageHeight.text = `Total Page Height: ${totalHeight}px`;
    // graphics
    this.bgLine.clear().beginFill(0xFFFFFF, 0.2).drawRect(0, 0, 2, clientHeight);
    this.currentLine.clear().beginFill(0xFFFF00, 0.5).drawRect(0, 0, 2, clientHeight * totalScrolled);
  }
  
}
