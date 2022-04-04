import Object from './object.js'

export default class Door extends Object {
  interactive = true
  collider = {
    type: 'box',
    halfWidth: 15,
    halfHeight: 4
  }

  constructor({game, x, y}) {
    super({
      game,
      name: 'door',
      x,
      y,
    })
  }

  open() {
    this.isOpen = this.collider.disabled = true
  }

  close() {
    this.isOpen = this.collider.disabled = false
  }

  use() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  draw() {
    this.spriteElement.style.transform = `${this.isOpen ? 'rotate(-90deg)' : ''}`
  }
}
