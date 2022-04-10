import Component from './component.js'

function intersectBoxBox(a, b) {
  const aBounding = a.getBoundingBox()
  const bBounding = b.getBoundingBox()

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
    super.update(dt)

    this.colliders.filter(collider => collider.type === 'kinematic').forEach(a => {
      this.colliders.forEach(b => {
        if (a === b) return

        if (intersectBoxBox(a, b)) {
          // TODO: Slidey physics
          a.gameObject.position.set(a.prevPos.x, a.prevPos.y)
        }
      })
    })
  }
}
