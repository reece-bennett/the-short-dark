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
    if (Math.random() < 0.8) {
      game.objects.push(new Container({
        game,
        x,
        y: y + 40,
        inventory: Item.createLoot()
      }))
    }
    game.objects.push(building)
  }

  for (let i = 0; i < 30; i++) {
    let { x, y } = randomXY(maxDistance)
    createCluster({
      game,
      objects: [Rock, Rock, Rock, Rock],
      objectProps: [
        { width: 20, height: 20 },
        { width: 30, height: 20 },
        { width: 50, height: 50 },
        { width: 10, height: 10 },
      ],
      x,
      y,
      objectCount: Math.round(Math.random() * 10),
      radius: Math.random() * 200
    })
  }

  for (let i = 0; i < 30; i++) {
    let { x, y } = randomXY(maxDistance)
    createCluster({
      game,
      objects: [Tree, Tree, Tree],
      objectProps: [
        { size: Math.round(Math.random() * 3), snowy: Math.random() > 0.3 },
        { size: Math.round(Math.random() * 3), snowy: Math.random() > 0.3 },
        { size: Math.round(Math.random() * 3), snowy: Math.random() > 0.3 }
      ],
      x,
      y,
      objectCount: Math.round(Math.random() * 5),
      radius: Math.random() * 200
    })
  }

  for (let i = 0; i < 10; i++) {
    let { x, y } = randomXY(maxDistance)
    const bear = new Bear({ game, x, y })
    bear.spawn()
    while (game.objects.some(other => intersect(
      { x: bear.x, y: bear.y, collider: bear.spawnCollider },
      { x: other.x, y: other.y, collider: other.spawnCollider }
    ))) {
      ({ x, y } = randomXY(maxDistance))
      bear.x = x
      bear.y = y
    }
    game.objects.push(bear)
  }
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
        $('.player .reload').style.transition = 'width 0s linear'
        $('.player .reload').style.width = '100%'
        setTimeout(() => {
          $('.player .reload').style.transition = 'width 1200ms linear'
          $('.player .reload').style.width = '0%'
        }, 0)
      } else if (name === 'Revolver' && game.timestamp - lastUsage > 500) {
        const bullet = new Bullet({ game, x: game.player.x, y: game.player.y, rotation: game.player.rotation, damage: 5 })
        bullet.spawn()
        game.objects.push(bullet)
        lastUsage = game.timestamp
        $('.player .reload').style.transition = 'width 0s linear'
        $('.player .reload').style.width = '100%'
        setTimeout(() => {
          $('.player .reload').style.transition = 'width 500ms linear'
          $('.player .reload').style.width = '0%'
        }, 0)
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
