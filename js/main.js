import Player from './player.js'
import Container from './container.js'
import Item from './item.js'
import createCluster from './cluster.js'
import Rock from './rock.js'
import Tree from './tree.js'
import Bear from './bear.js'
import Building from './building.js'
import { intersect } from './collision.js'
import { $, randomXY } from './util.js'
import Bullet from './bullet.js'
import { Tracks } from './tracks.js'
import GameObject from './gameObject.js'
import Sprite from './sprite.js'
import Vec2 from './vec2.js'
import Input from './input.js'
import Camera from './camera.js'
import FollowMouse from './followMouse.js'
import BoxCollider from './boxCollider.js'
import CollisionResolver from './collisionResolver.js'
import CircleCollider from './circleCollider.js'

let previousTimestamp = 0
let fps = 0
let lastUiDraw = 0

const maxDistance = 1500

let lastUsage = 0

const game = {
  running: true,
  duration: 0,
  keyDown: new Set(),
  keyPressed: new Set(),
  mouse: {
    x: 0,
    y: 0,
    isDown: false
  },
  camera: {
    x: 0,
    y: 0
  },
  objects: []
}

let scene

function generateWorld() {
  scene = new GameObject({
    name: 'Scene',
    components: [
      new CollisionResolver({})
    ]
  })

  $('.game').innerHTML = '' // Should go inside scene.create()?

  // game.tracks = new Tracks({game})
  // game.tracks.spawn()
  // game.objects.push(game.tracks)

  scene.addChild(new GameObject({
    name: 'Camera',
    components: [
      new Camera({})
    ]
  }))

  scene.addChild(new GameObject({
    name: 'Player',
    components: [
      new Input({}),
      new FollowMouse({}),
      new CircleCollider({
        type: 'kinematic',
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
      })
    ]
  }))

  // game.player = new Player(game, 0, 0, game.tracks)
  // game.objects.push(game.player)
  // game.player.spawn()

  // for (let i = 0; i < 20; i++) {
  //   let { x, y } = randomXY(maxDistance)
  //   x = Math.round(x / 300) * 300
  //   y = Math.round(y / 300) * 300
  //   const building = new Building(game, x, y)
  //   while (game.objects.some(other => intersect(
  //     { x: building.x, y: building.y, collider: building.spawnCollider },
  //     { x: other.x, y: other.y, collider: other.spawnCollider }
  //   ))) {
  //     ({ x, y } = randomXY(maxDistance))
  //     x = Math.round(x / 300) * 300
  //     y = Math.round(y / 300) * 300
  //     building.x = x
  //     building.y = y
  //     building.door.x = x
  //     building.door.y = y - 75
  //     building.door.draw()
  //   }
  //   if (Math.random() < 0.8) {
  //     game.objects.push(new Container({
  //       game,
  //       x,
  //       y: y + 40,
  //       inventory: Item.createLoot()
  //     }))
  //   }
  //   game.objects.push(building)
  // }

  // for (let i = 0; i < 30; i++) {
  //   let { x, y } = randomXY(maxDistance)
  //   createCluster({
  //     game,
  //     objects: [Rock, Rock, Rock, Rock],
  //     objectProps: [
  //       { width: 20, height: 20 },
  //       { width: 30, height: 20 },
  //       { width: 50, height: 50 },
  //       { width: 10, height: 10 },
  //     ],
  //     x,
  //     y,
  //     objectCount: Math.round(Math.random() * 10),
  //     radius: Math.random() * 200
  //   })
  // }

  // for (let i = 0; i < 30; i++) {
  //   let { x, y } = randomXY(maxDistance)
  //   createCluster({
  //     game,
  //     objects: [Tree, Tree, Tree],
  //     objectProps: [
  //       { size: Math.round(Math.random() * 3), snowy: Math.random() > 0.3 },
  //       { size: Math.round(Math.random() * 3), snowy: Math.random() > 0.3 },
  //       { size: Math.round(Math.random() * 3), snowy: Math.random() > 0.3 }
  //     ],
  //     x,
  //     y,
  //     objectCount: Math.round(Math.random() * 5),
  //     radius: Math.random() * 200
  //   })
  // }

  // for (let i = 0; i < 10; i++) {
  //   let { x, y } = randomXY(maxDistance)
  //   const bear = new Bear({ game, x, y })
  //   bear.spawn()
  //   while (game.objects.some(other => intersect(
  //     { x: bear.x, y: bear.y, collider: bear.spawnCollider },
  //     { x: other.x, y: other.y, collider: other.spawnCollider }
  //   ))) {
  //     ({ x, y } = randomXY(maxDistance))
  //     bear.x = x
  //     bear.y = y
  //   }
  //   game.objects.push(bear)
  // }
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
  // Input events
  document.addEventListener('keydown', event => {
    game.keyDown.add(event.code)
    game.keyPressed.add(event.code)
    event.preventDefault()
  })

  document.addEventListener('keyup', event => {
    game.keyDown.delete(event.code)
  })

  document.addEventListener('mousemove', event => {
    game.mouse.x = event.clientX
    game.mouse.y = event.clientY
  })

  document.body.addEventListener('mousedown', event => {
    if (event.button === 0) {
      game.mouse.isDown = true
    }
  })

  document.body.addEventListener('mouseup', () => {
    if (event.button === 0) {
      game.mouse.isDown = false
    }
  })

  document.addEventListener('contextmenu', event => event.preventDefault())

  $('.restart.button').addEventListener('click', () => {
    restart()
  })

  $('.start.button').addEventListener('click', () => {
    restart()
    $('.title-screen').setAttribute('aria-hidden', true)
    $('.stats').setAttribute('aria-hidden', false)
  })

  generateWorld()
  draw()
  restart()
  $('.title-screen').setAttribute('aria-hidden', true)
  $('.stats').setAttribute('aria-hidden', false)
}

function update(dt) {
  // if (game.mouse.isDown && game.player.equipped && !game.player.inventoryOpen) {
  //   const name = game.player.equipped.name
  //   if (name === 'Rifle' && game.timestamp - lastUsage > 1200) {
  //     const bullet = new Bullet({ game, x: game.player.x, y: game.player.y, rotation: game.player.rotation, damage: 10 })
  //     bullet.spawn()
  //     game.objects.push(bullet)
  //     lastUsage = game.timestamp
  //     $('.player .reload').style.transition = 'width 0s linear'
  //     $('.player .reload').style.width = '100%'
  //     setTimeout(() => {
  //       $('.player .reload').style.transition = 'width 1200ms linear'
  //       $('.player .reload').style.width = '0%'
  //     }, 0)
  //   } else if (name === 'Revolver' && game.timestamp - lastUsage > 500) {
  //     const bullet = new Bullet({ game, x: game.player.x, y: game.player.y, rotation: game.player.rotation, damage: 5 })
  //     bullet.spawn()
  //     game.objects.push(bullet)
  //     lastUsage = game.timestamp
  //     $('.player .reload').style.transition = 'width 0s linear'
  //     $('.player .reload').style.width = '100%'
  //     setTimeout(() => {
  //       $('.player .reload').style.transition = 'width 500ms linear'
  //       $('.player .reload').style.width = '0%'
  //     }, 0)
  //   }
  // }

  // game.objects.forEach(gameObject => gameObject.update(dt))
  // game.objects = game.objects.filter(gameObject => !gameObject.isDead)

  game.keyPressed.clear()
}

function draw() {
  game.objects.forEach(gameObject => gameObject.draw())
}

function step(timestamp) {
  if (previousTimestamp === undefined) previousTimestamp = timestamp
  const dt = (timestamp - previousTimestamp) * 0.001
  game.timestamp = timestamp
  game.duration += timestamp - previousTimestamp

  // Debug
  // fps = (fps * 0.9) + ((1 / dt) * 0.1)
  // if (timestamp - lastUiDraw > 500) {
  //   $('.fps').innerText = Math.round(fps)
  //   lastUiDraw = timestamp
  // }

  scene.update(dt)
  scene.lateUpdate(dt)
  scene.draw()

  previousTimestamp = timestamp
  if (game.running) window.requestAnimationFrame(step)
}

init()
