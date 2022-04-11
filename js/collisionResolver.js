import BoxCollider from './BoxCollider.js'
import CircleCollider from './circleCollider.js'
import Component from './component.js'
import Vec2 from './vec2.js'

function checkBoxBox(a, b) {
  const aBounding = a.getBoundingBox()
  const bBounding = b.getBoundingBox()

  return (aBounding.left <= bBounding.right && aBounding.right >= bBounding.left) &&
    (aBounding.top <= bBounding.bottom && aBounding.bottom >= bBounding.top)
}

function checkBoxCircle(box, circle) {
  const bounding = box.getBoundingBox()
  // The point inside box closest to circle
  const point = new Vec2(
    Math.max(Math.min(circle.gameObject.position.x, bounding.right), bounding.left),
    Math.max(Math.min(circle.gameObject.position.y, bounding.bottom), bounding.top)
  )
  return circle.gameObject.position.subtract(point).length() < circle.radius
}

function checkCircleCircle(a, b) {
  return a.gameObject.position.subtract(b.gameObject.position).length() < (a.radius + b.radius)
}

// https://developer.ibm.com/tutorials/wa-build2dphysicsengine/
function resolveBoxBox(a, b) {
  const diff = b.gameObject.position.subtract(a.gameObject.position)
  const dx = diff.x / (b.width / 2)
  const dy = diff.y / (b.height / 2)

  const bBounding = b.getBoundingBox()

  if (Math.abs(dx) > Math.abs(dy)) {
    if (diff.x > 0) {
      // From left
      a.gameObject.position.x = bBounding.left - (a.width / 2)
    } else {
      // From right
      a.gameObject.position.x = bBounding.right + (a.width / 2)
    }
  } else {
    if (diff.y > 0) {
      // From top
      a.gameObject.position.y = bBounding.top - (a.height / 2)
    } else {
      // From bottom
      a.gameObject.position.y = bBounding.bottom + (a.height / 2)
    }
  }
}

function resolveCircleBox(circle, box) {
  const diff = box.gameObject.position.subtract(circle.gameObject.position)
  const dx = diff.x / (box.width / 2)
  const dy = diff.y / (box.height / 2)

  const bounding = box.getBoundingBox()

  if (Math.abs(dx) > Math.abs(dy)) {
    if (diff.x > 0) {
      // From left
      circle.gameObject.position.x = bounding.left - circle.radius
    } else {
      // From right
      circle.gameObject.position.x = bounding.right + circle.radius
    }
  } else {
    if (diff.y > 0) {
      // From top
      circle.gameObject.position.y = bounding.top - circle.radius
    } else {
      // From bottom
      circle.gameObject.position.y = bounding.bottom + circle.radius
    }
  }
}

function resolveBoxCircle(box, circle) {
  const diff = circle.gameObject.position.subtract(box.gameObject.position)
  const dx = diff.x / (box.width / 2)
  const dy = diff.y / (box.height / 2)

  if (Math.abs(dx) > Math.abs(dy)) {
    if (diff.x > 0) {
      // From left
      box.gameObject.position.x = circle.gameObject.position.x - circle.radius - (box.width / 2)
    } else {
      // From right
      box.gameObject.position.x = circle.gameObject.position.x + circle.radius + (box.width / 2)
    }
  } else {
    if (diff.y > 0) {
      // From top
      box.gameObject.position.y = circle.gameObject.position.y - circle.radius - (box.height / 2)
    } else {
      // From bottom
      box.gameObject.position.y = circle.gameObject.position.y + circle.radius + (box.height / 2)
    }
  }
}

function resolveCircleCircle(a, b) {
  const diff = a.gameObject.position.subtract(b.gameObject.position)
  const depth = (a.radius + b.radius) - diff.length()
  const resized = diff.resize(depth)
  a.gameObject.position = a.gameObject.position.add(resized)
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

        if (a instanceof BoxCollider && b instanceof BoxCollider) {
          if (!checkBoxBox(a, b)) return
          resolveBoxBox(a, b)
        } else if (a instanceof CircleCollider && b instanceof CircleCollider) {
          if (!checkCircleCircle(b, a)) return
          resolveCircleCircle(a, b)
        } else if (a instanceof BoxCollider && b instanceof CircleCollider) {
          if (!checkBoxCircle(a, b)) return
          resolveBoxCircle(a, b)
        } else if (a instanceof CircleCollider && b instanceof BoxCollider) {
          if (!checkBoxCircle(b, a)) return
          resolveCircleBox(a, b)
        }

        // TODO: Send message with collision information
      })
    })
  }
}
