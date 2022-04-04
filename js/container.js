import { $ } from './util.js'
import Object from './object.js'

export default class Container extends Object {
  isOpen = false
  interactive = true

  constructor({game, x, y, inventory}) {
    super({
      game,
      name: 'container',
      x,
      y,
      width: 25,
      height: 15,
    })

    this.inventory = inventory
    this.spawnColloider = this.collider = {
      type: 'box',
      halfWidth: this.width / 2,
      halfHeight: this.height / 2
    }

    this.spawn()
  }

  open() {
    this.isOpen = true
    this.game.player.openInventory(this)
    this.updateInventoryUi()
    $('.tab-container').setAttribute('aria-hidden', false)
  }

  close() {
    this.isOpen = false
    if (this.game.player.inventoryOpen) this.game.player.closeInventory()
    $('.tab-container').setAttribute('aria-hidden', true)
  }

  use() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  untarget() {
    this.close()
  }

  updateInventoryUi() {
    const containerTab = $('.tab-container')
    containerTab.innerHTML = ''
    this.inventory.forEach((item, index) => {
      const row = document.createElement('div')
      row.classList.add('row')
      row.innerText = item.name
      row.addEventListener('click', () => {
        this.removeFromInventory(index)
        this.game.player.addToInventory(item)
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
