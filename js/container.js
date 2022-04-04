import { $, createDiv } from './util.js'

export default class Container {
  x
  y
  opened = false
  inventory
  element
  sprite
  collider = {
    type: 'box',
    halfWidth: 12.5,
    halfHeight: 7.5
  }
  spawnCollider = this.collider

  constructor(game, x, y, inventory) {
    this.game = game
    this.x = x
    this.y = y
    this.inventory = inventory

    this.objectElement = createDiv($('.game'), 'object', 'container')
    this.objectElement.addEventListener('click', () => {
      if (this.game.player.distanceTo(this.x, this.y) < 50) {
        if (this.opened) {
          this.close()
        } else {
          this.open()
        }
      }
    })
    this.sprite = createDiv(this.objectElement, 'sprite')
    this.interactive = true
  }

  update() {}

  draw() {
    this.objectElement.style.transform = `translate(${this.x}px, ${this.y}px)`
  }

  open() {
    console.log('Container opened')
    this.opened = true
    this.game.player.openInventory(this)
    this.updateInventoryUi()
    $('.tab-container').setAttribute('aria-hidden', false)
  }

  close() {
    console.log('Container closed')
    this.opened = false
    if (this.game.player.inventoryOpen) this.game.player.closeInventory()
    $('.tab-container').setAttribute('aria-hidden', true)
  }

  use() {
    if (this.opened) {
      this.close()
    } else {
      this.open()
    }
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
