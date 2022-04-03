import { $, createSpriteElementFromXml } from './util.js'

function createObjectElement(name) {
  const objectElement = document.createElement('div')
  objectElement.className = `object ${name}`

  return objectElement
}

export default class Object {
  constructor({game, name, x, y, width, height, rotation, spriteXml}) {
    this.game = game
    this.name = name ?? 'Mysterious Object'
    this.x = x ?? 0
    this.y = y ?? 0
    this.width = width ?? 0
    this.height = height ?? 0
    this.rotation = rotation ?? 0
    this.objectElement = createObjectElement(name)
    this.isDead = false

    if (spriteXml) {
      this.spriteElement = createSpriteElementFromXml(spriteXml)
      this.spriteElement.style.width = `${this.width}px`
      this.spriteElement.style.height = `${this.height}px`
      this.objectElement.append(this.spriteElement)
    }
  }

  spawn() {
    // Element transform perhaps shouldn't be done in spawn()?
    // Either way, it needs to take into account camera position?...
    this.objectElement.style.transform = `translate(${this.x}px, ${this.y}px)`
    $('.game').append(this.objectElement)
  }

  update() {

  }

  draw() {
    this.objectElement.style.transform = `translate(${this.x}px, ${this.y}px)`
    this.spriteElement.style.transform = `rotate(${this.rotation}rad)`
    this.spriteElement.style.setProperty('--rvx', Math.sin(this.rotation + Math.PI / 4))
    this.spriteElement.style.setProperty('--rvy', Math.cos(this.rotation + Math.PI / 4))
  }

  kill() {
    this.isDead = true
    this.objectElement.remove()
  }
}
