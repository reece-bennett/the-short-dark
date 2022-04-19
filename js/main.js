
import { $ } from './util.js'
import GameObject from './gameObject.js'
import Sprite from './sprite.js'
import Vec2 from './vec2.js'
import KeyboardMovement from './keyboardMovement.js'
import Camera from './camera.js'
import FollowMouse from './followMouse.js'
import BoxCollider from './boxCollider.js'
import CircleCollider from './circleCollider.js'
import Input from './input.js'
import PlayerBehaviour from './playerBehaviour.js'
import Body from './body.js'
import BodyType from './bodyType.js'
import Physics from './physics.js'
import Container from './container.js'
import Item from './item.js'
import waterBottle from './items/waterBottle.js'
import cola from './items/cola.js'
import PlayerInventory from './playerInventory.js'

const game = {
  running: true,
  duration: 0,
  timestamp: 0
}

let previousTimestamp = 0
let scene

function generateWorld() {
  scene = new GameObject({
    name: 'Scene'
  })

  $('.world').innerHTML = '' // Should go inside scene.create()?

  scene.addChild(new GameObject({
    name: 'Camera',
    components: [
      new Camera({})
    ]
  }))

  const player = scene.addChild(new GameObject({
    name: 'Player',
    components: [
      new KeyboardMovement({}),
      new FollowMouse({}),
      new PlayerBehaviour({}),
      new PlayerInventory({}),
      new Body({
        type: BodyType.KINEMATIC
      }),
      new CircleCollider({
        radius: 8
      }),
      new Sprite({
        classname: 'player',
        xml: `
          <sprite>
            <leftarm/>
            <rightarm/>
            <body/>
            <head/>
            <item/>
          </sprite>`
      })
    ]
  }))

  player.addChild(new GameObject({
    name: 'InteractionRadius',
    components: [
      new CircleCollider({
        radius: 40
      }),
      new Sprite({
        classname: 'circle-outline',
        width: 80,
        height: 80
      }),
      new Body({
        type: BodyType.TRIGGER,
        layer: 2
      })
    ]
  }))

  scene.addChild(new GameObject({
    name: 'Chest',
    position: new Vec2(-100, 0),
    components: [
      new Sprite({
        classname: 'container',
        width: 25,
        height: 15
      }),
      new BoxCollider({
        width: 25,
        height: 15
      }),
      new Body({
        type: BodyType.STATIC,
        layer: 3
      })
    ]
  }))

  scene.addChild(new GameObject({
    name: 'Chest2',
    position: new Vec2(-80, 50),
    components: [
      new Sprite({
        classname: 'container',
        width: 25,
        height: 15
      }),
      new BoxCollider({
        width: 25,
        height: 15
      }),
      new Body({
        type: BodyType.STATIC,
        layer: 3
      }),
      new Container({
        items: [new Item(waterBottle), new Item(cola), new Item(waterBottle)]
      })
    ]
  }))

  scene.addChild(new GameObject({
    name: 'Building',
    position: new Vec2(100, 200),
    components: [
      new Sprite({
        classname: 'building',
        xml: `
          <sprite>
            <wall/>
            <door/>
            <roof/>
          </sprite>`
      }),
      new BoxCollider({
        width: 150,
        height: 150
      }),
      new Body({
        type: BodyType.STATIC
      })
    ]
  }))

  scene.addChild(new GameObject({
    name: 'Rock',
    position: new Vec2(100, 0),
    components: [
      new Sprite({
        classname: 'rock',
        width: 32,
        height: 32
      }),
      new BoxCollider({
        width: 32,
        height: 32
      }),
      new Body({
        type: BodyType.STATIC
      })
    ]
  }))
}

function restart() {
  generateWorld()
  game.running = true
  game.duration = 0
  previousTimestamp = undefined
  $('.gameover').setAttribute('aria-hidden', true)
  scene.create()
  window.requestAnimationFrame(step)
}

function init() {
  Input.createListeners()

  $('.restart.button').addEventListener('click', () => {
    restart()
  })

  $('.start.button').addEventListener('click', () => {
    restart()
    $('.title-screen').setAttribute('aria-hidden', true)
    $('.stats').setAttribute('aria-hidden', false)
  })

  // generateWorld()
  restart()
  $('.title-screen').setAttribute('aria-hidden', true)
  $('.stats').setAttribute('aria-hidden', false)
}

function step(timestamp) {
  if (previousTimestamp === undefined) previousTimestamp = timestamp
  const dt = (timestamp - previousTimestamp) * 0.001
  game.timestamp = timestamp
  game.duration += timestamp - previousTimestamp

  Input.update()
  scene.update(dt)
  Physics.update()
  scene.lateUpdate(dt)
  scene.draw()

  previousTimestamp = timestamp
  if (game.running) window.requestAnimationFrame(step)
}

init()
