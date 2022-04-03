import Player from './player.js'
import Container from './container.js'
import Item from './item.js'
// import Cluster from './cluster.js'
import Rock from './rock.js'
import Tree from './tree.js'
import Bear from './bear.js'
import Building from './building.js'
import { intersect } from './collision.js'
import { $ } from './util.js'

let previousTimestamp = 0
let fps = 0
let lastUiDraw = 0

const maxDistance = 1500

const game = {}
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

// Create a scary bear, as specific x/y coords
const bear = new Bear({ x: 200, y: 300, game })
// Spawn the bear - currently only adds it to the scene, but should start AI(?)
bear.spawn()

const tree = new Tree({x: 200, y: 100, game, size: 0})
tree.spawn()
const tree2 = new Tree({x: 250, y: 100, game, size: 1})
tree2.spawn()
const tree3 = new Tree({x: 300, y: 100, game, size: 2})
tree3.spawn()
const tree4 = new Tree({x: 350, y: 100, game, size: 3})
tree4.spawn()
const tree5 = new Tree({x: 400, y: 100, game, size: 1, snowy: true})
tree5.spawn()
const tree6 = new Tree({x: 450, y: 100, game, size: 2, snowy: true})
tree6.spawn()
const tree7 = new Tree({x: 500, y: 100, game, size: 3, snowy: true})
tree7.spawn()

const rock = new Rock({x: 200, y: 200, game})
rock.spawn()
const rock2 = new Rock({x: 230, y: 220, game})
rock2.spawn()
const rock3 = new Rock({x: 240, y: 185, game})
rock3.spawn()

game.objects.push(
  game.player,
  bear,
  tree,
  tree2,
  tree3,
  tree4,
  tree5,
  tree6,
  tree7,
  rock,
  rock2,
  rock3
  // The idea here is that you can spawn a cluster of rocks or mixed whatevers
  // new Cluster({objects: [Rock], x: 200, y: 300, width: 20, height: 40, density: 20})
)

function randomXY() {
  return {
    x: (Math.random() * 2 - 1) * maxDistance,
    y: (Math.random() * 2 - 1) * maxDistance
  }
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

  // World generation
  for (let i = 0; i < 20; i++) {
    let { x, y } = randomXY()
    x = Math.round(x / 300) * 300
    y = Math.round(y / 300) * 300
    const building = new Building(game, x, y)
    while (game.objects.some(other => intersect(
      { x: building.x, y: building.y, collider: building.spawnCollider },
      { x: other.x, y: other.y, collider: other.spawnCollider }
    ))) {
      ({ x, y } = randomXY())
      x = Math.round(x / 300) * 300
      y = Math.round(y / 300) * 300
      building.x = x
      building.y = y
    }
    if (Math.random() > 0.5) {
      game.objects.push(new Container(game, x, y, [Item.waterBottle(), Item.beefJerky(), Item.beefJerky(), Item.cola(), Item.energyBar()]))
    }
    game.objects.push(building)
  }

  for (let i = 0; i < 200; i++) {
    let { x, y } = randomXY()
    const rock = new Rock({ game, x, y })
    rock.spawn()
    while (game.objects.some(other => intersect(
      { x: rock.x, y: rock.y, collider: rock.spawnCollider },
      { x: other.x, y: other.y, collider: other.spawnCollider }
    ))) {
      ({ x, y } = randomXY())
      rock.x = x
      rock.y = y
    }
    game.objects.push(rock)
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

  // Debug
  fps = (fps * 0.9) + ((1 / dt) * 0.1)
  if (timestamp - lastUiDraw > 500) {
    $('.fps').innerText = Math.round(fps)
    lastUiDraw = timestamp
  }

  update(dt)

  draw()

  previousTimestamp = timestamp
  window.requestAnimationFrame(step)
}

init()
