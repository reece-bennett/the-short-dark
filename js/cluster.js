import { intersect } from './collision.js'
import { $, randomXY, distanceBetween } from './util.js'

function addDebugCircle(x, y, radius) {
  const debugCircleElement = document.createElement('div')
  debugCircleElement.style.width = `${radius * 2}px`
  debugCircleElement.style.height = `${radius * 2}px`
  debugCircleElement.style.borderRadius = '50%'
  const randomSaturation = Math.floor(Math.random() * 30) * 12;
  debugCircleElement.style.background = `hsl(${randomSaturation}, 100%, 50%, .2)`
  debugCircleElement.style.position = 'absolute'
  debugCircleElement.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
  $('.game').append(debugCircleElement)
}

const maxSpawnAttemptsPerObject = 100;

export default function createCluster({
  game,
  objects,
  objectProps,
  x,
  y,
  radius = 100,
  objectCount = 20,
  circular = true,
  gap = 4,
}) {
  addDebugCircle(x, y, radius);

  for (let i = 0; i < objectCount; i++) {
    let spawnAttempts = 1;
    const randomObjectIndex = Math.floor(Math.random() * objects.length)
    const RandomObject = objects[randomObjectIndex];
    const randomObjectProps = objectProps[randomObjectIndex];
    const { x: objectX, y: objectY } = randomXY(radius)
    const object = new RandomObject({
      game,
      x: x + objectX,
      y: y + objectY,
      ...randomObjectProps,
    })

    const placementFail = () => {
      return (
        game.objects.some(other => intersect(
          {
            x: object.x,
            y: object.y,
            collider: {
              ...object.spawnCollider,
              halfWidth: object.spawnCollider.halfWidth + gap,
              halfHeight: object.spawnCollider.halfHeight + gap,
              radius: object.spawnCollider.radius + gap,
            },
          },
          {
            x: other.x,
            y: other.y,
            collider: other.spawnCollider,
          },
        )) ||
        // Too far from center of cluster
        (circular && distanceBetween(x, y, object.x, object.y) > radius)
      )
    }

    while (spawnAttempts < maxSpawnAttemptsPerObject && placementFail()) {
      spawnAttempts++
      let { x: objectX, y: objectY } = randomXY(radius)
      object.x = x + objectX
      object.y = y + objectY
    }

    if (!placementFail()) {
      object.spawn()
      game.objects.push(object)
    }
  }
}
