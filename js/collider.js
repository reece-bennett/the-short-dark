import Component from './component.js'
import Vec2 from './vec2.js'

export default class Collider extends Component {
  constructor({ name }) {
    super({ name: name ?? 'Collider' })
    this.prevPos = new Vec2()
  }

  create() {
    this.gameObject.getGameObject('/CollisionResolver').addCollider(this)
  }

  lastUpdate(dt) {
    super.lastUpdate(dt)
    this.prevX.set(this.gameObject.position.x, this.gameObject.position.y)
  }
}
