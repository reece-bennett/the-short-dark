import { intersect } from './collision.js'
import { $, createDiv } from './util.js'

export default class Building {
  x
  y
  element
  sprite
  isOpen
  door
  doorCollider = { offsetX: 0, offsetY: -75, halfWidth: 15, halfHeight: 4 }
  collider = {
    type: 'multiBox',
    boxes: [
      { offsetX: -45, offsetY: -71, halfWidth: 30, halfHeight: 4 },
      { offsetX: 45, offsetY: -71, halfWidth: 30, halfHeight: 4 },
      { offsetX: 71, offsetY: 0, halfWidth: 4, halfHeight: 75 },
      { offsetX: 0, offsetY: 71, halfWidth: 75, halfHeight: 4 },
      { offsetX: -71, offsetY: 0, halfWidth: 4, halfHeight: 75 },
      this.doorCollider
    ]
  }
  roofCollider = {
    type: 'box',
    halfWidth: 75,
    halfHeight: 75
  }
  spawnCollider = this.roofCollider
  playerWasInsideCooldown = 0

  constructor(game, x, y) {
    this.game = game
    this.x = x
    this.y = y

    this.element = createDiv($('.game'), 'object', 'building')
    this.sprite = createDiv(this.element, 'sprite')
    createDiv(this.sprite, 'wall')
    this.door = createDiv(this.sprite, 'door')
    this.door.addEventListener('click', () => {
      if (game.player.distanceTo(this.x, this.y - 75) < 50) {
        if (this.isOpen) {
          this.close()
        } else {
          this.open()
        }
      }
    })
    this.roof = createDiv(this.sprite, 'roof')
  }

  updatePlayerIsInside(dt) {
    this.playerIsInside = intersect(this.game.player, { x: this.x, y: this.y, collider: this.roofCollider })

    // outside -> inside
    if (this.playerIsInside && !this.element.classList.contains('player-inside')) {
      this.game.player.temperature.ambient = 30 // Inside temperature
      this.element.classList.add('player-inside')
      this.element.style.zIndex = '1000' // Can be set as a number, but is a string internally and when returned
      this.playerWasInsideCooldown = 1 // Must be > than the transition for fading out the you're-inside-this-building shadow
    // inside -> outside
    } else if (!this.playerIsInside && this.element.classList.contains('player-inside')) {
      this.game.player.temperature.ambient = -13 // Outside temperature
      this.element.classList.remove('player-inside')
    }

    if (!this.playerIsInside) {
      this.playerWasInsideCooldown = Math.max(0, this.playerWasInsideCooldown - dt)
    }

    if (this.playerWasInsideCooldown === 0 && this.element.style.zIndex === '1000') {
      this.element.style.zIndex = '' // Don't override z-index set in object CSS
    }
  }

  update(dt) {
    this.updatePlayerIsInside(dt)
  }

  draw() {
    this.element.style.transform =`translate(${this.x}px, ${this.y}px)`
    this.door.style.transform = `translate(0, -75px)${this.isOpen ? 'rotate(-90deg)' : ''}`
  }

  open() {
    console.log('Door opened')
    this.isOpen = true
    this.doorCollider.offsetX = -15
    // this.doorCollider.offsetY = -90
    // this.doorCollider.halfWidth = 4
    // this.doorCollider.halfHeight = 15
    this.doorCollider.halfWidth = 0
    this.doorCollider.halfHeight = 0
  }

  close() {
    console.log('Door closed')
    this.isOpen = false
    this.doorCollider.offsetX = 0
    // this.doorCollider.offsetY = -75
    this.doorCollider.halfWidth = 15
    this.doorCollider.halfHeight = 4
  }
}
