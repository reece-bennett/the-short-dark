import { $, angleBetween, createDiv, distanceBetween } from './util.js'
import Item from './item.js'
import { intersect } from './collision.js'

export default class Player {
  x
  y
  isSprinting = false
  inventory = [Item.waterBottle()]
  inventoryOpen = false
  lookingIn
  element
  sprite
  collider = {
    type: 'circle',
    radius: 7
  }

  // Stats in percentages
  health = 1
  temperature = 1
  energy = 1
  food = 1
  water = 1

  constructor(game, x, y) {
    this.game = game
    this.x = x
    this.y = y

    this.element = createDiv($('.game'), 'object', 'player')
    this.sprite = createDiv(this.element, 'sprite')
    createDiv(this.sprite, 'body')
    createDiv(this.sprite, 'head')
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
          break
        }
      }

      this.energy -= (this.isSprinting ? 0.05 : 0.02) * dt
    }

    // Update camera
    this.game.camera.x = this.x - window.innerWidth / 2
    this.game.camera.y = this.y - window.innerHeight / 2

    if (this.game.keyPressed.has('Tab')) {
      if (this.inventoryOpen) {
        this.closeInventory()
      } else {
        this.openInventory()
      }
    }

    this.temperature -= 0.005 * dt
    this.energy -= 0.004 * dt
    this.food -= 0.004 * dt
    this.water -= 0.006 * dt
  }

  draw() {
    const screenX = this.x - this.game.camera.x
    const screenY = this.y - this.game.camera.y
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`
    this.sprite.style.transform = `rotate(${angleBetween(screenX, screenY, this.game.mouse.x, this.game.mouse.y)}rad)`
    $('.game').style.transform = `translate(${-this.game.camera.x}px, ${-this.game.camera.y}px)`
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
    if (this.lookingIn) {
      this.lookingIn.close()
      this.lookingIn = undefined
    }
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
    $('.progress.temperature').style.setProperty('--p', `${this.temperature * 100}%`)
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
