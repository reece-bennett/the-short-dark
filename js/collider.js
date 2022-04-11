import Component from './component.js'

export default class Collider extends Component {
  constructor({ type, ...params }) {
    super(params)
    this.type = type ?? 'static'
  }

  create() {
    this.gameObject.root().getComponent('CollisionResolver').addCollider(this)
  }
}
