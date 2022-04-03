import Player from './player.js'
import Container from './container.js'
import Item from './item.js'
// import Cluster from './cluster.js'
import Rock from './rock.js'
import Bear from './bear.js'
import Building from './building.js'

let previousTimestamp

const game = {}
game.keyDown = new Set()
game.keyPressed = new Set()
game.mouse = {
  x: 0,
  y: 0
}
game.objects = []
game.player = new Player(game, 400, 300)

// Create a scary bear, as specific x/y coords
const bear = new Bear({x:200, y:300})
// Spawn the bear - currently only adds it to the scene, but should start AI(?)
bear.spawn()

const rock = new Rock({x: 200, y: 200})
rock.spawn()
const rock2 = new Rock({x: 230, y: 220})
rock2.spawn()
const rock3 = new Rock({x: 240, y: 185})
rock3.spawn()

game.objects.push(
  game.player,
  new Container(game, 440, 360, [Item.waterBottle(), Item.beefJerky(), Item.beefJerky(), Item.cola(), Item.energyBar()]),
  new Container(game, 100, 300, [Item.waterBottle(), Item.waterBottle()]),
  new Building(game, 400, 300),
  new Building(game, 800, 300),
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

  // console.log(timestamp, dt)

  update(dt)

  draw()

  previousTimestamp = timestamp
  window.requestAnimationFrame(step)
}

init()
