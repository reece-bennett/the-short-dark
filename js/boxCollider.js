import Collider from './collider.js'

export default class BoxCollider extends Collider {
  constructor({ width, height, ...params }) {
    super(params)
    this.width = width ?? 0
    this.height = height ?? 0
  }

  getBoundingBox() {
    const gPos = this.gameObject.getGlobalPosition()
    return {
      top: gPos.y - this.height / 2,
      right: gPos.x + this.width / 2,
      bottom: gPos.y + this.height / 2,
      left: gPos.x - this.width / 2
    }
  }
}
