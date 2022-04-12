import Collider from './collider.js'

export default class BoxCollider extends Collider {
  constructor({ offsetX, offsetY, width, height, ...params }) {
    super(params)
    this.offsetX = offsetX ?? 0
    this.offsetY = offsetY ?? 0
    this.width = width ?? 0
    this.height = height ?? 0
  }

  getBoundingBox() {
    return {
      top: this.gameObject.position.y - this.height / 2,
      right: this.gameObject.position.x + this.width / 2,
      bottom: this.gameObject.position.y + this.height / 2,
      left: this.gameObject.position.x - this.width / 2
    }
  }
}