import { $ } from './util.js'

export default class Container {
  x
  y
  player
  opened = false
  inventory = ['Flare', 'Gun']

  constructor(x, y, player) {
    this.x = x
    this.y = y
    this.player = player

    $('.container').addEventListener('click', () => {
      console.log('Clicked')
      const dx = this.x - player.x
      const dy = this.y - player.y
      if (Math.sqrt(dx * dx + dy * dy) < 50) {
        if (this.opened) {
          this.close()
        } else {
          this.open()
        }
      }
    })
  }

  draw() {
    $('.container').style.transform = `translate(${this.x}px, ${this.y}px)`
  }

  open() {
    console.log('Container opened')
    this.opened = true
    this.player.openInventory(this)
    this.updateInventoryUi()
    $('.tab-container').setAttribute('aria-hidden', false)
  }

  close() {
    console.log('Container closed')
    this.opened = false
    if (this.player.inventoryOpen) this.player.closeInventory()
    $('.tab-container').setAttribute('aria-hidden', true)
  }

  updateInventoryUi() {
    const containerTab = $('.tab-container')
    containerTab.innerHTML = ''
    this.inventory.forEach((item, index) => {
      const row = document.createElement('div')
      row.classList.add('row')
      row.innerText = item
      row.addEventListener('click', () => {
        this.removeFromInventory(index)
        this.player.addToInventory(item)
      })
      containerTab.append(row)
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
