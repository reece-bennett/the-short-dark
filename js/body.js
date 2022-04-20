import Collider from './collider.js'
import Component from './component.js'
import Physics from './physics.js'

export default class Body extends Component {
  constructor({ type, layer, ...params }) {
    super(params)
    if (!type) console.error('Body must have a type', this)
    this.type = type
    this.layer = layer ?? 1
    this.colliders = []
  }

  create() {
    this.colliders = this.gameObject.getComponentsByClass(Collider)
    this.colliders.forEach(collider => collider.body = this)
    Physics.addBody(this)
  }
}
