import Player from './player.js'
import Container from './container.js'
import Item from './item.js'
// import Cluster from './cluster.js'
import Rock from './rock.js'
import Tree from './tree.js'
import Bear from './bear.js'
import Building from './building.js'
import { intersect } from './collision.js'
import { $, randomXY } from './util.js'

let previousTimestamp = 0
let fps = 0
let lastUiDraw = 0

const maxDistance = 1500

const game = {}
game.running = true
game.keyDown = new Set()
game.keyPressed = new Set()
game.mouse = {
  x: 0,
  y: 0
}
game.camera = {
  x: 0,
  y: 0
}
game.objects = []
game.player = new Player(game, 0, 0)
game.player.spawn()

// Create a scary bear, as specific x/y coords
const bear = new Bear({ x: 500, y: 0, game })
const bear2 = new Bear({ x: -20, y: -400, game })
// Spawn the bear - currently only adds it to the scene, but should start AI(?)
bear.spawn()
bear2.spawn()

game.objects.push(
  game.player,
  bear,
  bear2
  // The idea here is that you can spawn a cluster of rocks or mixed whatevers
  // new Cluster({objects: [Rock], x: 200, y: 300, width: 20, height: 40, density: 20})
)

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

  // World generation
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
      game.objects.push(new Container(game, x, y + 40, [Item.waterBottle(), Item.beefJerky(), Item.beefJerky(), Item.cola(), Item.energyBar()]))
    }
    game.objects.push(building)
  }

  for (let i = 0; i < 200; i++) {
    let { x, y } = randomXY(maxDistance)
    const rock = new Rock({ game, x, y })
    rock.spawn()
    while (game.objects.some(other => intersect(
      { x: rock.x, y: rock.y, collider: rock.spawnCollider },
      { x: other.x, y: other.y, collider: other.spawnCollider }
    ))) {
      ({ x, y } = randomXY(maxDistance))
      rock.x = x
      rock.y = y
    }
    game.objects.push(rock)
  }

  for (let i = 0; i < 100; i++) {
    let { x, y } = randomXY(maxDistance)
    const tree = new Tree({ game, x, y, size: Math.round(Math.random() * 3), snowy: Math.random() > 0.6 })
    tree.spawn()
    while (game.objects.some(other => intersect(
      { x: tree.x, y: tree.y, collider: tree.collider },
      { x: other.x, y: other.y, collider: other.spawnCollider }
    ))) {
      ({ x, y } = randomXY(maxDistance))
      tree.x = x
      tree.y = y
    }
    game.objects.push(tree)
  }

  // Start the main loop
  window.requestAnimationFrame(step)
}

function update(dt) {
  game.objects.forEach(gameObject => gameObject.update(dt))

  game.keyPressed.clear()
}

function draw() {
  game.objects.forEach(gameObject => gameObject.draw())
}

function step(timestamp) {
  if (previousTimestamp === undefined) previousTimestamp = timestamp
  const dt = (timestamp - previousTimestamp) * 0.001
  game.timestamp = timestamp

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
