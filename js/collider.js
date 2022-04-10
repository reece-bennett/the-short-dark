import Component from './component.js'
import Vec2 from './vec2.js'

export default class Collider extends Component {
  constructor({ name, type }) {
    super({ name: name ?? 'Collider' })
    this.type = type ?? 'static'
    this.prevPos = new Vec2()
  }

  create() {
    this.gameObject.getRootGameObject().getComponent('CollisionResolver').addCollider(this)
  }

  lateUpdate(dt) {
    super.lateUpdate(dt)
    this.prevPos.set(this.gameObject.position.x, this.gameObject.position.y)
  }
}
