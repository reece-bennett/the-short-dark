import { $, createDiv } from './util.js'
import Item from './item.js'

export default class Player {
  x
  y
  speed = 100
  keyDown
  keyPressed
  inventory = [Item.waterBottle()]
  inventoryOpen = false
  lookingIn
  element
  sprite

  // Stats in percentages
  health = 1
  temperature = 1
  energy = 1
  food = 1
  water = 1

  constructor(x, y, keyDown, keyPressed) {
    this.x = x
    this.y = y
    this.keyDown = keyDown
    this.keyPressed = keyPressed

    this.element = createDiv($('.game'), 'object', 'player')
    this.sprite = createDiv(this.element, 'sprite')
    createDiv(this.sprite, 'body')
    createDiv(this.sprite, 'head')
  }

  update(dt) {
    let vx = 0
    let vy = 0

    if (this.keyDown.has('KeyW')) vy--
    if (this.keyDown.has('KeyD')) vx++
    if (this.keyDown.has('KeyS')) vy++
    if (this.keyDown.has('KeyA')) vx--

    // Normalise
    const length = Math.sqrt(vx * vx + vy * vy)
    if (length > 0) {
      vx /= length
      vy /= length

      // Adjust for player speed and delta
      vx *= 100 * dt
      vy *= 100 * dt

      this.x += vx
      this.y += vy

      this.energy -= 0.02 * dt
    }

    if (this.keyPressed.has('Tab')) {
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
    $('.player').style.transform = `translate(${this.x}px, ${this.y}px)`
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
}
