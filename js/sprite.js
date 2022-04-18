import Component from './component.js'
import { $, createDiv, createSpriteElementFromXml } from './util.js'

export default class Sprite extends Component {
  constructor({ width, height, classname, xml, ...params }) {
    super(params)
    this.width = width
    this.height = height
    this.objectElement = createDiv('object', classname)
    this.spriteElement = this.objectElement.appendChild(createSpriteElementFromXml(xml ?? '<sprite/>'))
    this.spriteElement.style.width = `${this.width}px`
    this.spriteElement.style.height = `${this.height}px`
  }

  create() {
    super.create()
    $('.world').appendChild(this.objectElement)
  }

  draw() {
    super.draw()
    const gPos = this.gameObject.getGlobalPosition()
    this.objectElement.style.transform = `translate(${gPos.x}px, ${gPos.y}px)`
    this.spriteElement.style.transform = `rotate(${this.gameObject.rotation}rad)`
  }

  destroy() {
    super.destroy()
    this.objectElement.remove()
  }

  addClass(cssClass) {
    this.objectElement.classList.add(cssClass)
  }

  removeClass(cssClass) {
    this.objectElement.classList.remove(cssClass)
  }
}
