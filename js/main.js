import Player from './player.js'
import Container from './container.js'
import Item from './item.js'
// import Cluster from './cluster.js'
// import Rock from './rock.js'
import Bear from './bear.js';

let previousTimestamp

const keyDown = new Set()
const keyPressed = new Set()

const player = new Player(100, 100, keyDown, keyPressed)

// Create a scary bear, as specific x/y coords
const bear = new Bear({x:200, y:300})
// Spawn the bear - currently only adds it to the scene, but should start AI(?)
bear.spawn()

const gameObjects = [
  player,
  new Container(200, 100, player, [Item.waterBottle(), Item.beefJerky(), Item.beefJerky(), Item.cola(), Item.energyBar()]),
  new Container(100, 300, player, [Item.waterBottle(), Item.waterBottle()]),
  // The idea here is that you can spawn a cluster of rocks or mixed whatevers
  // new Cluster({objects: [Rock], x: 200, y: 300, width: 20, height: 40, density: 20})
]

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
