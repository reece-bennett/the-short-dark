import Player from './player.js'
import Container from './container.js'
import Item from './item.js'
// import Cluster from './cluster.js'
import Rock from './rock.js'
import Tree from './tree.js'
import Bear from './bear.js';
import Building from './building.js'

let previousTimestamp

const keyDown = new Set()
const keyPressed = new Set()

const mouse = {
  x: 0,
  y: 0
}

const gameObjects = []
const player = new Player(400, 300, keyDown, keyPressed, mouse, gameObjects)

// Create a scary bear, as specific x/y coords
const bear = new Bear({x:200, y:300})
// Spawn the bear - currently only adds it to the scene, but should start AI(?)
bear.spawn()

const tree = new Tree({x: 200, y: 100, size: 0})
tree.spawn()
const tree2 = new Tree({x: 250, y: 100, size: 1})
tree2.spawn()
const tree3 = new Tree({x: 300, y: 100, size: 2})
tree3.spawn()
const tree4 = new Tree({x: 350, y: 100, size: 3})
tree4.spawn()
const tree5 = new Tree({x: 400, y: 100, size: 1, snowy: true})
tree5.spawn()
const tree6 = new Tree({x: 450, y: 100, size: 2, snowy: true})
tree6.spawn()
const tree7 = new Tree({x: 500, y: 100, size: 3, snowy: true})
tree7.spawn()

const rock = new Rock({x: 200, y: 200})
rock.spawn()
const rock2 = new Rock({x: 230, y: 220})
rock2.spawn()
const rock3 = new Rock({x: 240, y: 185})
rock3.spawn()

gameObjects.push(
  player,
  new Container(440, 360, player, [Item.waterBottle(), Item.beefJerky(), Item.beefJerky(), Item.cola(), Item.energyBar()]),
  new Container(100, 300, player, [Item.waterBottle(), Item.waterBottle()]),
  new Building(400, 300, player),
  bear,
  rock,
  rock2,
  rock3
  // The idea here is that you can spawn a cluster of rocks or mixed whatevers
  // new Cluster({objects: [Rock], x: 200, y: 300, width: 20, height: 40, density: 20})
)

function init() {
  // Initialise stuff
  document.addEventListener('keydown', event => {
    keyDown.add(event.code)
    keyPressed.add(event.code)
    event.preventDefault()
  })

  document.addEventListener('keyup', event => {
    keyDown.delete(event.code)
  })

  document.addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
  })

  // Start the main loop
  window.requestAnimationFrame(step)
}

function update(dt) {
  gameObjects.forEach(gameObject => gameObject.update(dt))

  keyPressed.clear()
}

function draw() {
  gameObjects.forEach(gameObject => gameObject.draw())
}

function step(timestamp) {
  if (previousTimestamp === undefined) previousTimestamp = timestamp
  const dt = (timestamp - previousTimestamp) * 0.001

  // console.log(timestamp, dt)

  update(dt)

  draw()

  previousTimestamp = timestamp
  window.requestAnimationFrame(step)
}

init()
