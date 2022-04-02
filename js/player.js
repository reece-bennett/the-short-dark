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
    }

    if (this.keyPressed.has('Tab')) {
      if (this.inventoryOpen) {
        this.closeInventory()
      } else {
        this.openInventory()
      }
    }
  }

  draw() {
    $('.player').style.transform = `translate(${this.x}px, ${this.y}px)`
    $('.inventory').setAttribute('aria-hidden', !this.inventoryOpen)
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
