import Collider from './collider.js'

export default class CircleCollider extends Collider {
  constructor({ offsetX, offsetY, radius, ...params }) {
    super(params)
    this.offsetX = offsetX ?? 0
    this.offsetY = offsetY ?? 0
    this.radius = radius ?? 0
  }
}
