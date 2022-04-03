import { $, createDiv } from './util.js'

export default class Building {
  x
  y
  player
  element
  sprite
  isOpen
  door

  constructor(x, y, player) {
    this.x = x
    this.y = y
    this.player = player

    this.element = createDiv($('.game'), 'object', 'building')
    this.sprite = createDiv(this.element, 'sprite')
    createDiv(this.sprite, 'wall')
    this.door = createDiv(this.sprite, 'door')
    this.door.addEventListener('click', () => {
      if (player.distanceTo(this.x, this.y - 75) < 50) {
        if (this.isOpen) {
          this.close()
        } else {
          this.open()
        }
      }
    })
    this.roof = createDiv(this.sprite, 'roof')
  }

  update() {
    this.roof.setAttribute('aria-hidden', this.player.distanceTo(this.x, this.y) < 75)
  }

  draw() {
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`
    this.door.style.transform = `translate(0, -75px)${this.isOpen ? 'rotate(-90deg)' : ''}`
  }

  open() {
    console.log('Door opened')
    this.isOpen = true

  }

  close() {
    console.log('Door closed')
    this.isOpen = false
  }
}
