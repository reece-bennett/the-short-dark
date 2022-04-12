import Collider from './collider.js'

export default class CircleCollider extends Collider {
  constructor({ radius, ...params }) {
    super(params)
    this.radius = radius ?? 0
  }
}
