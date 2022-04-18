import Body from './body.js'
import BodyType from './bodyType.js'
import BoxCollider from './boxCollider.js'
import BuildingBehaviour from './buildingBehaviour.js'
import Door from './door.js'
import GameObject from './gameObject.js'
import Sprite from './sprite.js'
import Vec2 from './vec2.js'

export default function createBuilding({ position, doorSide }) {
  const building = new GameObject({
    name: 'Building',
    position,
    components: [
      new Sprite({
        classname: 'building',
        xml: `
          <sprite>
            <wall/>
            <roof/>
          </sprite>`
      }),
      new Body({
        type: BodyType.STATIC
      }),
      new BuildingBehaviour({})
    ]
  })
  if (doorSide === 'top') {
    building.addComponent(new BoxCollider({ position: new Vec2(-45, -71), width: 60, height: 8 }))
    building.addComponent(new BoxCollider({ position: new Vec2(45, -71), width: 60, height: 8 }))
  } else {
    building.addComponent(new BoxCollider({ position: new Vec2(0, -71), width: 150, height: 8 }))
  }
  if (doorSide === 'right') {
    building.addComponent(new BoxCollider({ position: new Vec2(71, -45), width: 8, height: 60 }))
    building.addComponent(new BoxCollider({ position: new Vec2(71, 45), width: 8, height: 60 }))
  } else {
    building.addComponent(new BoxCollider({ position: new Vec2(71, 0), width: 8, height: 150 }))
  }
  if (doorSide === 'bottom') {
    building.addComponent(new BoxCollider({ position: new Vec2(-45, 71), width: 60, height: 8 }))
    building.addComponent(new BoxCollider({ position: new Vec2(45, 71), width: 60, height: 8 }))
  } else {
    building.addComponent(new BoxCollider({ position: new Vec2(0, 71), width: 150, height: 8 }))
  }
  if (doorSide === 'left') {
    building.addComponent(new BoxCollider({ position: new Vec2(-71, -45), width: 8, height: 60 }))
    building.addComponent(new BoxCollider({ position: new Vec2(-71, 45), width: 8, height: 60 }))
  } else {
    building.addComponent(new BoxCollider({ position: new Vec2(-71, 0), width: 8, height: 150 }))
  }

  building.addChild(new GameObject({
    name: 'InteractionArea',
    components: [
      new BoxCollider({
        width: 150,
        height: 150
      }),
      new Body({
        type: BodyType.TRIGGER,
        layer: 4
      })
    ]
  }))

  const door = building.addChild(new GameObject({
    name: 'Door',
    components: [
      new Sprite({
        classname: 'door'
      }),
      new Body({
        type: BodyType.STATIC,
        layer: 3
      }),
      new Door({})
    ]
  }))
  switch(doorSide) {
    case 'top':
      door.position = new Vec2(0, -75)
      door.addComponent(new BoxCollider({ width: 30, height: 8 }))
      break
    case 'right':
      door.position = new Vec2(90, -15)
      door.rotation = Math.PI * 0.5
      door.addComponent(new BoxCollider({ width: 8, height: 30, position: new Vec2(-15, 15) }))
      break
    case 'bottom':
      door.position = new Vec2(30, 75)
      door.rotation = Math.PI
      door.addComponent(new BoxCollider({ width: 30, height: 8, position: new Vec2(-30, 0) }))
      break
    case 'left':
      door.position = new Vec2(-60, 15)
      door.rotation = Math.PI * 1.5
      door.addComponent(new BoxCollider({ width: 8, height: 30, position: new Vec2(-15, -15) }))
      break
  }

  return building
}
