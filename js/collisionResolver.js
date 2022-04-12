import BoxCollider from './boxCollider.js'
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
  const circlePos = circle.gameObject.getGlobalPosition()
  // The point inside box closest to circle
  const point = new Vec2(
    Math.max(Math.min(circlePos.x, bounding.right), bounding.left),
    Math.max(Math.min(circlePos.y, bounding.bottom), bounding.top)
  )
  return circlePos.subtract(point).length() < circle.radius
}

function checkCircleCircle(a, b) {
  return a.gameObject.getGlobalPosition().subtract(b.gameObject.getGlobalPosition()).length() < (a.radius + b.radius)
}

// https://developer.ibm.com/tutorials/wa-build2dphysicsengine/
function resolveBoxBox(a, b) {
  const aPos = a.gameObject.getGlobalPosition()
  const diff = b.gameObject.getGlobalPosition().subtract(aPos)
  const dx = diff.x / (b.width / 2)
  const dy = diff.y / (b.height / 2)

  const bBounding = b.getBoundingBox()

  if (Math.abs(dx) > Math.abs(dy)) {
    if (diff.x > 0) {
      // From left
      a.gameObject.setGlobalPosition(new Vec2(bBounding.left - (a.width / 2), aPos.y))
    } else {
      // From right
      a.gameObject.setGlobalPosition(new Vec2(bBounding.right + (a.width / 2), aPos.y))
    }
  } else {
    if (diff.y > 0) {
      // From top
      a.gameObject.setGlobalPosition(new Vec2(aPos.x, bBounding.top - (a.height / 2)))
    } else {
      // From bottom
      a.gameObject.setGlobalPosition(new Vec2(aPos.x, bBounding.bottom + (a.height / 2)))
    }
  }
}

function resolveCircleBox(circle, box) {
  const circlePos = circle.gameObject.getGlobalPosition()
  const diff = box.gameObject.getGlobalPosition().subtract(circlePos)
  const dx = diff.x / (box.width / 2)
  const dy = diff.y / (box.height / 2)

  const bounding = box.getBoundingBox()

  if (Math.abs(dx) > Math.abs(dy)) {
    if (diff.x > 0) {
      // From left
      circle.gameObject.setGlobalPosition(new Vec2(bounding.left - circle.radius, circlePos.y))
    } else {
      // From right
      circle.gameObject.setGlobalPosition(new Vec2(bounding.right + circle.radius, circlePos.y))
    }
  } else {
    if (diff.y > 0) {
      // From top
      circle.gameObject.setGlobalPosition(new Vec2(circlePos.x, bounding.top - circle.radius))
    } else {
      // From bottom
      circle.gameObject.setGlobalPosition(new Vec2(circlePos.x, bounding.bottom + circle.radius))
    }
  }
}

function resolveBoxCircle(box, circle) {
  const boxPos = box.getGlobalPosition()
  const circlePos = circle.getGlobalPosition()
  const diff = circlePos.subtract(boxPos)
  const dx = diff.x / (box.width / 2)
  const dy = diff.y / (box.height / 2)

  if (Math.abs(dx) > Math.abs(dy)) {
    if (diff.x > 0) {
      // From left
      box.gameObject.setGlobalPosition(new Vec2(circlePos.x - circle.radius - (box.width / 2), boxPos.y))
    } else {
      // From right
      box.gameObject.setGlobalPosition(new Vec2(circlePos.x + circle.radius + (box.width / 2), boxPos.y))
    }
  } else {
    if (diff.y > 0) {
      // From top
      box.gameObject.setGlobalPosition(new Vec2(boxPos.x, circlePos.y - circle.radius - (box.height / 2)))
    } else {
      // From bottom
      box.gameObject.setGlobalPosition(new Vec2(boxPos.x, circlePos.y + circle.radius + (box.height / 2)))
    }
  }
}

function resolveCircleCircle(a, b) {
  const aPos = a.gameObject.getGlobalPosition()
  const diff = aPos.subtract(b.gameObject.getGlobalPosition())
  const depth = (a.radius + b.radius) - diff.length()
  const resized = diff.resize(depth)
  a.gameObject.setGlobalPosition(aPos.add(resized))
}


export default class CollisionResolver extends Component {
  constructor(params) {
    super(params)
    this.colliders = []
    this.collisions = []
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
          if (b.type !== 'area') resolveBoxBox(a, b)
        } else if (a instanceof CircleCollider && b instanceof CircleCollider) {
          if (!checkCircleCircle(b, a)) return
          if (b.type !== 'area') resolveCircleCircle(a, b)
        } else if (a instanceof BoxCollider && b instanceof CircleCollider) {
          if (!checkBoxCircle(a, b)) return
          if (b.type !== 'area') resolveBoxCircle(a, b)
        } else if (a instanceof CircleCollider && b instanceof BoxCollider) {
          if (!checkBoxCircle(b, a)) return
          if (b.type !== 'area') resolveCircleBox(a, b)
        }

        if (!this.collisions.some(pair => pair[0] === a && pair[1] === b)) {
          this.collisions.push([a, b])
          a.gameObject.dispatchEvent(new CustomEvent('collisionStart', { detail: {
            collider: a,
            otherCollider: b
          }}))
          b.gameObject.dispatchEvent(new CustomEvent('collisionStart', { detail: {
            collider: b,
            otherCollider: a
          }}))
        }
      })
    })

    for (let i = this.collisions.length - 1; i >= 0; i--) {
      const [a, b] = this.collisions[i]
      if (a instanceof BoxCollider && b instanceof BoxCollider) {
        if (checkBoxBox(a, b)) return
      } else if (a instanceof CircleCollider && b instanceof CircleCollider) {
        if (checkCircleCircle(b, a)) return
      } else if (a instanceof BoxCollider && b instanceof CircleCollider) {
        if (checkBoxCircle(a, b)) return
      } else if (a instanceof CircleCollider && b instanceof BoxCollider) {
        if (checkBoxCircle(b, a)) return
      }
      this.collisions.splice(i, 1)
      a.gameObject.dispatchEvent(new CustomEvent('collisionEnd', { detail: {
        collider: a,
        otherCollider: b
      }}))
      b.gameObject.dispatchEvent(new CustomEvent('collisionEnd', { detail: {
        collider: b,
        otherCollider: a
      }}))
    }
  }
}
