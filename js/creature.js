import Object from './object.js'

export default class Creature extends Object {
  constructor({game, name, x, y, width, height, spriteXml}) {
    super({
      game,
      name,
      x,
      y,
      width,
      height,
      spriteXml,
    })
  }

  doCleverAiStuff() {
    // ...
  }

  growl() {
    // ...
  }
}
