import Component from './component.js'
import Vec2 from './vec2.js'

export default class Collider extends Component {
  constructor({ position, ...params }) {
    super(params)
    this.position = position ?? new Vec2()
    this.body = null
  }

  getGlobalPosition() {
    return this.gameObject.getGlobalPosition().add(this.position)
  }
}
