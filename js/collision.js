import { distanceBetween } from './util.js'

function calculateMinMax(box) {
  return {
    minX: box.x - box.collider.halfWidth,
    maxX: box.x + box.collider.halfWidth,
    minY: box.y - box.collider.halfHeight,
    maxY: box.y + box.collider.halfHeight
  }
}

function intersectBoxBox(a, b) {
  const aa = calculateMinMax(a)
  const bb = calculateMinMax(b)

  return (aa.minX <= bb.maxX && aa.maxX >= bb.minX) &&
    (aa.minY <= bb.maxY && aa.maxY >= bb.minY)
}

function intersectCircleBox(circle, box) {
  // Get closest point to circle by clamping
  const bb = calculateMinMax(box)
  const x = Math.max(bb.minX, Math.min(circle.x, bb.maxX))
  const y = Math.max(bb.minY, Math.min(circle.y, bb.maxY))

  return distanceBetween(x, y, circle.x, circle.y) < circle.collider.radius
}

function intersectCircleCircle(a, b) {
  return distanceBetween(a.x, a.y, b.x, b.y) < (a.collider.radius + b.collider.radius)
}

function intersectMultiBoxBox(multi, box) {
  return multi.collider.boxes.some(multiBox => intersectBoxBox(box, {
    x: multi.x + multiBox.offsetX,
    y: multi.y + multiBox.offsetY,
    collider: multiBox
  }))
}

function intersectMultiBoxCircle(multi, circle) {
  return multi.collider.boxes.some(multiBox => intersectCircleBox(circle, {
    x: multi.x + multiBox.offsetX,
    y: multi.y + multiBox.offsetY,
    collider: multiBox
  }))
}

function intersectMultiBoxMultiBox(a, b) {
  return a.collider.boxes.some(multiBox => intersectMultiBoxBox(b, {
    x: a.x + multiBox.offsetX,
    y: a.y + multiBox.offsetY,
    collider: multiBox
  }))
}

export function intersect(a, b) {
  if (!a.collider || a.collider.disabled || !b.collider || b.collider.disabled) return false

  if (distanceBetween(a.x, a.y, b.x, b.y) > 100) return false

  const typeA = a.collider.type
  const typeB = b.collider.type

  switch (typeA) {
  case 'box':
    switch (typeB) {
    case 'box':
      return intersectBoxBox(a, b)
    case 'circle':
      return intersectCircleBox(b, a)
    case 'multiBox':
      return intersectMultiBoxBox(b, a)
    }
    break
  case 'circle':
    switch (typeB) {
    case 'box':
      return intersectCircleBox(a, b)
    case 'circle':
      return intersectCircleCircle(a, b)
    case 'multiBox':
      return intersectMultiBoxCircle(b, a)
    }
    break
  case 'multiBox':
    switch (typeB) {
    case 'box':
      return intersectMultiBoxBox(a, b)
    case 'circle':
      return intersectMultiBoxCircle(a, b)
    case 'multiBox':
      return intersectMultiBoxMultiBox(a, b)
    }
    break
  }
  console.error('Unknown collider combination', a, b)
}
