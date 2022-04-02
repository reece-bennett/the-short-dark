import { $ } from './util.js'

export default class Player {
  x
  y
  speed = 100
  keyDown
  keyPressed
  inventory = ['Beeeef', 'Water']
  inventoryOpen = false
  lookingIn

  // Stats in percentages
  health = 100
  temperature = 100
  energy = 100
  food = 100
  water = 100

  constructor(x, y, keyDown, keyPressed) {
    this.x = x
    this.y = y
    this.keyDown = keyDown
    this.keyPressed = keyPressed
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

      this.energy -= 2 * dt
    }

    if (this.keyPressed.has('Tab')) {
      if (this.inventoryOpen) {
        this.closeInventory()
      } else {
        this.openInventory()
      }
    }

    this.temperature -= 0.5 * dt
    this.energy -= 0.4 * dt
    this.food -= 0.4 * dt
    this.water -= 0.6 * dt
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
      row.innerText = item
      row.addEventListener('click', () => {
        if (this.lookingIn) {
          this.removeFromInventory(index)
          this.lookingIn.addToInventory(item)
        }
      })
      playerTab.append(row)
    })
  }

  updateStatsUi() {
    $('.progress.health').style.setProperty('--p', `${this.health}%`)
    $('.progress.temperature').style.setProperty('--p', `${this.temperature}%`)
    $('.progress.energy').style.setProperty('--p', `${this.energy}%`)
    $('.progress.food').style.setProperty('--p', `${this.food}%`)
    $('.progress.water').style.setProperty('--p', `${this.water}%`)
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
