import Player from './player.js'
import Container from './container.js'

let previousTimestamp

const keyDown = new Set()
const keyPressed = new Set()

const player = new Player(100, 100, keyDown, keyPressed)
const container = new Container(200, 100, player)

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
  player.update(dt)

  keyPressed.clear()
}

function draw() {
  player.draw()
  container.draw()
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
