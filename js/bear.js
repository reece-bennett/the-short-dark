import Creature from './creature.js'

export default class Bear extends Creature {
  collider = {
    type: 'circle',
    radius: 18
  }

  constructor({x, y}) {
    super({
      name: 'bear',
      x: x,
      y: y,
      width: 20,
      height: 30,
      spriteXml: `
        <sprite>
          <tail></tail>
          <body></body>
          <head>
            <nose></nose>
            <ear></ear>
            <ear></ear>
          </head>
        </sprite>
      `
    })
  }
}
