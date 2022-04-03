import { $, createSpriteElementFromXml } from './util.js'

function createObjectElement(name) {
  const objectElement = document.createElement('div')
  objectElement.className = `object ${name}`

  return objectElement
}

export default class Object {
  constructor({name, x, y, width, height, rotation, spriteXml}) {
    this.name = name ?? 'Mysterious Object'
    this.x = x ?? 0
    this.y = y ?? 0
    this.width = width ?? 0
    this.height = height ?? 0
    this.rotation = rotation ?? 0
    this.objectElement = createObjectElement(name)
    this.objectElement.style.width = `${this.width}px`
    this.objectElement.style.height = `${this.height}px`

    if (spriteXml) {
      this.spriteElement = createSpriteElementFromXml(spriteXml)
      this.objectElement.append(this.spriteElement)
    }
  }

  spawn() {
    // Element transform perhaps shouldn't be done in spawn()?
    // Either way, it needs to take into account camera position?...
    this.objectElement.style.transform = `translate(${this.x}px, ${this.y}px)`
    $('.game').append(this.objectElement)
  }
}
