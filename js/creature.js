import Object from './object.js'

export default class Creature extends Object {
  constructor({name, x, y, width, height, spriteXml}) {
    super({
      name: name,
      x: x,
      y: y,
      width: width,
      height: height,
      spriteXml: spriteXml,
    })
  }

  doCleverAiStuff() {
    // ...
  }

  growl() {
    // ...
  }
}
