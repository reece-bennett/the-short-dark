import BodyType from './bodyType.js'
import BoxCollider from './boxCollider.js'
import CircleCollider from './circleCollider.js'
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


export default {
  kinematicBodies: [],
  staticBodies: [],
  triggerBodies: [],
  collisions: [],

  addBody(body) {
    switch (body.type) {
    case BodyType.KINEMATIC:
      this.kinematicBodies.push(body)
      break
    case BodyType.STATIC:
      this.staticBodies.push(body)
      break
    case BodyType.TRIGGER:
      this.triggerBodies.push(body)
      break
    }
  },

  update() {
    this.kinematicBodies.forEach(kinematicBody => {
      this.staticBodies.forEach(staticBody => {
        if ((kinematicBody.layer & staticBody.layer) === 0) return
        kinematicBody.colliders.forEach(kinematicCollider => {
          staticBody.colliders.forEach(staticCollider => {
            if (kinematicCollider instanceof BoxCollider && staticCollider instanceof BoxCollider) {
              if (!checkBoxBox(kinematicCollider, staticCollider)) return
              resolveBoxBox(kinematicCollider, staticCollider)
            } else if (kinematicCollider instanceof CircleCollider && staticCollider instanceof CircleCollider) {
              if (!checkCircleCircle(kinematicCollider, staticCollider)) return
              resolveCircleCircle(kinematicCollider, staticCollider)
            } else if (kinematicCollider instanceof BoxCollider && staticCollider instanceof CircleCollider) {
              if (!checkBoxCircle(kinematicCollider, staticCollider)) return
              resolveBoxCircle(kinematicCollider, staticCollider)
            } else if (kinematicCollider instanceof CircleCollider && staticCollider instanceof BoxCollider) {
              if (!checkBoxCircle(staticCollider, kinematicCollider)) return
              resolveCircleBox(kinematicCollider, staticCollider)
            }
          })
        })
      })
    })

    this.triggerBodies.forEach(triggerBody => {
      this.kinematicBodies.concat(this.staticBodies).forEach(otherBody => {
        if ((triggerBody.layer & otherBody.layer) === 0) return
        triggerBody.colliders.forEach(triggerCollider => {
          otherBody.colliders.forEach(otherCollider => {
            if (triggerCollider instanceof BoxCollider && otherCollider instanceof BoxCollider) {
              if (!checkBoxBox(triggerCollider, otherCollider)) return
            } else if (triggerCollider instanceof CircleCollider && otherCollider instanceof CircleCollider) {
              if (!checkCircleCircle(triggerCollider, otherCollider)) return
            } else if (triggerCollider instanceof BoxCollider && otherCollider instanceof CircleCollider) {
              if (!checkBoxCircle(triggerCollider, otherCollider)) return
            } else if (triggerCollider instanceof CircleCollider && otherCollider instanceof BoxCollider) {
              if (!checkBoxCircle(otherCollider, triggerCollider)) return
            }

            if (!this.collisions.some(pair => pair[0] === triggerCollider && pair[1] === otherCollider)) {
              this.collisions.push([triggerCollider, otherCollider])
              triggerBody.gameObject.dispatchEvent(new CustomEvent('triggerEntered', {
                detail: {
                  collider: triggerCollider,
                  otherCollider: otherCollider
                }
              }))
            }
          })
        })
      })
    })

    for (let i = this.collisions.length - 1; i >= 0; i--) {
      const [a, b] = this.collisions[i]
      if ((a instanceof BoxCollider && b instanceof BoxCollider && !checkBoxBox(a, b))
        || (a instanceof CircleCollider && b instanceof CircleCollider && !checkCircleCircle(b, a))
        || (a instanceof BoxCollider && b instanceof CircleCollider && !checkBoxCircle(a, b))
        || (a instanceof CircleCollider && b instanceof BoxCollider && !checkBoxCircle(b, a))) {
        this.collisions.splice(i, 1)
        a.gameObject.dispatchEvent(new CustomEvent('triggerExited', {
          detail: {
            collider: a,
            otherCollider: b
          }
        }))
      }
    }
  }
}
