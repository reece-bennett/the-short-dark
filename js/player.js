import { $, angleBetween, createDiv, distanceBetween } from './util.js'
import Creature from './creature.js'
import Item from './item.js'
import { intersect } from './collision.js'

export default class Player extends Creature {
  inventory = [Item.waterBottle()]
  inventoryOpen = false
  lookingIn

  collider = {
    type: 'circle',
    radius: 7
  }

  // Stats in percentages
  health = 1
  // temperature = 1
  energy = 1
  food = 1
  water = 1

  constructor(game, x, y) {
    super({
      game,
      name: 'player',
      x,
      y,
      spriteXml: `
        <sprite>
          <body/>
          <head/>
        </sprite>
      `,
    })

    this.temperature.tooCold = 10
    this.temperature.tooHot = 35
    this.temperature.coolRate = 0.002
    this.temperature.heatRate = 0.004
    this.temperature.buffer = 6
  }

  update(dt) {
    let vx = 0
    let vy = 0

    if (this.game.keyDown.has('KeyW')) vy--
    if (this.game.keyDown.has('KeyD')) vx++
    if (this.game.keyDown.has('KeyS')) vy++
    if (this.game.keyDown.has('KeyA')) vx--

    // Normalise
    const length = Math.sqrt(vx * vx + vy * vy)
    if (length > 0) {
      vx /= length
      vy /= length

      this.isSprinting = this.game.keyDown.has('ShiftLeft')

      // Adjust for player speed and delta
      const speed = this.isSprinting ? '120' : '60'
      vx *= speed * dt
      vy *= speed * dt

      const prevX = this.x
      const prevY = this.y

      this.x += vx
      this.y += vy

      for (const other of this.game.objects) {
        if (other !== this && intersect(this, other)) {
          this.x = prevX
          this.y = prevY
        }
      }

      this.energy -= (this.isSprinting ? 0.05 : 0.02) * dt
    }

    // Update camera
    this.game.camera.x = Math.max(Math.min(this.x - window.innerWidth / 2, window.innerWidth), 0)
    this.game.camera.y = Math.max(Math.min(this.y - window.innerHeight / 2, window.innerHeight), 0)

    if (this.game.keyPressed.has('Tab')) {
      if (this.inventoryOpen) {
        this.closeInventory()
      } else {
        this.openInventory()
      }
    }

    this.updateTemperature(dt, 15); // TODO: Fetch ambient temperature from somewhere
    this.energy -= 0.004 * dt
    this.food -= 0.004 * dt
    this.water -= 0.006 * dt
  }

  draw() {
    const screenX = this.x - this.game.camera.x
    const screenY = this.y - this.game.camera.y
    this.objectElement.style.transform = `translate(${screenX}px, ${screenY}px)`
    this.spriteElement.style.transform = `rotate(${angleBetween(screenX, screenY, this.game.mouse.x, this.game.mouse.y)}rad)`
    $('.inventory').setAttribute('aria-hidden', !this.inventoryOpen)
    this.updateStatsUi()
  }

  openInventory(container) {
    console.log(`Inventory opened${container ? ' with container' : ''}`)
    this.inventoryOpen = true
    if (container) this.lookingIn = container
    this.updateInventoryUi()
  }

  closeInventory() {
    console.log('Inventory closed')
    this.inventoryOpen = false
    if (this.lookingIn) this.lookingIn.close()
  }

  updateInventoryUi() {
    const playerTab = $('.tab-player')
    playerTab.innerHTML = ''
    this.inventory.forEach((item, index) => {
      const row = document.createElement('div')
      row.classList.add('row')
      row.innerText = item.name
      row.addEventListener('click', () => {
        if (this.lookingIn) {
          this.removeFromInventory(index)
          this.lookingIn.addToInventory(item)
        }
      })
      row.addEventListener('contextmenu', event => {
        event.preventDefault()
        item.use(this)
        this.inventory.splice(this.inventory.indexOf(item), 1)
        this.updateInventoryUi()
      })
      playerTab.append(row)
    })
  }

  updateStatsUi() {
    $('.progress.health').style.setProperty('--p', `${this.health * 100}%`)
    $('.progress.temperature').style.setProperty('--p', `${this.temperature.current}%`)
    $('.progress.energy').style.setProperty('--p', `${this.energy * 100}%`)
    $('.progress.food').style.setProperty('--p', `${this.food * 100}%`)
    $('.progress.water').style.setProperty('--p', `${this.water * 100}%`)
  }

  addToInventory(item) {
    this.inventory.push(item)
    this.updateInventoryUi()
  }

  removeFromInventory(index) {
    const item = this.inventory.splice(index, 1)
    this.updateInventoryUi()
    return item
  }

  distanceTo(x, y) {
    return distanceBetween(x, y, this.x, this.y)
  }
}
