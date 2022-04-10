import Component from './component.js'
import { createDiv, createSpriteElementFromXml } from './util.js'

export default class Sprite extends Component {
  constructor({ name, width, height, classname, xml }) {
    super({ name: name ?? 'Sprite' })
    this.width = width
    this.height = height
    this.objectElement = createDiv('object', classname)
    this.spriteElement = this.objectElement.appendChild(createSpriteElementFromXml(xml ?? '<sprite/>'))
    this.spriteElement.style.width = `${this.width}px`
    this.spriteElement.style.height = `${this.height}px`
  }

  create() {
    super.create()
    this.camera = this.gameObject.getGameObject('/Camera')
    document.querySelector('.game').appendChild(this.objectElement)
  }

  draw() {
    super.draw()
    this.objectElement.style.transform = `translate(${this.gameObject.position.x}px, ${this.gameObject.position.y}px)`
    this.spriteElement.style.transform = `rotate(${this.gameObject.rotation}rad)`
  }

  destroy() {
    super.destroy()
    this.objectElement.remove()
  }
}
