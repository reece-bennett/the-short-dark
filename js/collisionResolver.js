import { intersect } from './collision.js'
import Component from './component.js'

function intersectBoxBox(a, b) {
  const aBounding = a.getBoundingBox()
  const bBounding = b.getBoudningBox()

  return (aBounding.left <= bBounding.right && aBounding.right >= bBounding.left) &&
    (aBounding.top <= bBounding.bottom && aBounding.bottom >= bBounding.top)
}

export default class CollisionResolver extends Component {
  constructor({ name }) {
    super({ name: name ?? 'CollisionResolver' })
    this.colliders = []
  }

  addCollider(collider) {
    this.colliders.push(collider)
  }

  removeCollider(collider) {
    this.colliders.splice(this.colliders.indexOf(collider), 1)
  }

  update(dt) {
    this.colliders.forEach(a => {
      this.colliders.forEach(b => {
        if (a === b) return

        if (intersectBoxBox(a, b)) {
          if (!intersect) // TODO: do the previous postiion thingy here
        }
      })
    })
  }
}
