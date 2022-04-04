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
    y: 0
  },
  camera: {
    x: 0,
    y: 0
  },
  objects: []
}


function generateWorld() {
  $('.game').innerHTML = ''
  game.objects = []

  game.player = new Player(game, 0, 0)
  game.objects.push(game.player)
  game.player.spawn()

  for (let i = 0; i < 20; i++) {
    let { x, y } = randomXY(maxDistance)
    x = Math.round(x / 300) * 300
    y = Math.round(y / 300) * 300
    const building = new Building(game, x, y)
    while (game.objects.some(other => intersect(
      { x: building.x, y: building.y, collider: building.spawnCollider },
      { x: other.x, y: other.y, collider: other.spawnCollider }
    ))) {
      ({ x, y } = randomXY(maxDistance))
      x = Math.round(x / 300) * 300
      y = Math.round(y / 300) * 300
      building.x = x
      building.y = y
    }
    if (Math.random() > 0.5) {
      game.objects.push(new Container({
        game,
        x,
        y: y + 40,
        inventory: [Item.waterBottle(), Item.beefJerky(), Item.beefJerky(), Item.cola(), Item.energyBar()]
      }))
    }
    game.objects.push(building)
  }

  createCluster({
    game,
    objects: [Rock],
    objectProps: [{
      width: 20,
      height: 20,
    }],
    x: 180,
    y: -180,
    radius: 80
  })

  createCluster({
    game,
    objects: [Tree],
    objectProps: [{
      size: 3,
    }],
    x: -180,
    y: -180,
    radius: 60
  })

  createCluster({
    game,
    objects: [Tree],
    objectProps: [{
      size: 0,
    }],
    x: -130,
    y: -150,
    radius: 50
  })

  // for (let i = 0; i < 200; i++) {
  //   let { x, y } = randomXY(maxDistance)
  //   const rock = new Rock({ game, x, y })
  //   rock.spawn()
  //   while (game.objects.some(other => intersect(
  //     { x: rock.x, y: rock.y, collider: rock.spawnCollider },
  //     { x: other.x, y: other.y, collider: other.spawnCollider }
  //   ))) {
  //     ({ x, y } = randomXY(maxDistance))
  //     rock.x = x
  //     rock.y = y
  //   }
  //   game.objects.push(rock)
  // }
  //
  // for (let i = 0; i < 100; i++) {
  //   let { x, y } = randomXY(maxDistance)
  //   const tree = new Tree({ game, x, y, size: Math.round(Math.random() * 3), snowy: Math.random() > 0.6 })
  //   tree.spawn()
  //   while (game.objects.some(other => intersect(
  //     { x: tree.x, y: tree.y, collider: tree.spawnCollider },
  //     { x: other.x, y: other.y, collider: other.spawnCollider }
  //   ))) {
  //     ({ x, y } = randomXY(maxDistance))
  //     tree.x = x
  //     tree.y = y
  //   }
  //   game.objects.push(tree)
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

  game.objects.push(new Container({
    game,
    x: 30,
    y: 0,
    inventory: [Item.waterBottle(), Item.rifle(), Item.revolver()]
  }))
}

function restart() {
  generateWorld()
  game.running = true
  game.duration = 0
  previousTimestamp = undefined
  $('.gameover').setAttribute('aria-hidden', true)
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
    if (event.button === 0 && game.player.equipped && !game.player.inventoryOpen) {
      const name = game.player.equipped.name
      if (name === 'Rifle' && game.timestamp - lastUsage > 1200) {
        const bullet = new Bullet({ game, x: game.player.x, y: game.player.y, rotation: game.player.rotation, damage: 10 })
        bullet.spawn()
        game.objects.push(bullet)
        lastUsage = game.timestamp
      } else if (name === 'Revolver' && game.timestamp - lastUsage > 500) {
        const bullet = new Bullet({ game, x: game.player.x, y: game.player.y, rotation: game.player.rotation, damage: 5 })
        bullet.spawn()
        game.objects.push(bullet)
        lastUsage = game.timestamp
      }
    }
  })

  document.addEventListener('contextmenu', event => event.preventDefault())

  $('.restart-button').addEventListener('click', () => {
    restart()
  })

  generateWorld()

  // Start the main loop
  window.requestAnimationFrame(step)
}

function update(dt) {
  game.objects.forEach(gameObject => gameObject.update(dt))
  game.objects = game.objects.filter(gameObject => !gameObject.isDead)

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
  fps = (fps * 0.9) + ((1 / dt) * 0.1)
  if (timestamp - lastUiDraw > 500) {
    $('.fps').innerText = Math.round(fps)
    lastUiDraw = timestamp
  }

  update(dt)

  draw()

  previousTimestamp = timestamp
  if (game.running) window.requestAnimationFrame(step)
}

init()
