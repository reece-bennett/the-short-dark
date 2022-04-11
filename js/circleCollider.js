import Collider from './collider.js'

export default class CircleCollider extends Collider {
  constructor({ name, type, offsetX, offsetY, radius }) {
    super({ name: name ?? 'CircleCollider', type })
    this.offsetX = offsetX ?? 0
    this.offsetY = offsetY ?? 0
    this.radius = radius ?? 0
  }
}
