import Inventory from './inventory.js'
import { $ } from './util.js'

export default class PlayerInventory extends Inventory {
  constructor(params) {
    super(params)
    this.isOpen = false
    this.lookingIn = null
  }

  create() {
    document.addEventListener('keydown', event => {
      switch (event.code) {
        case 'Tab':
          if (this.isOpen) {
            this.close()
          } else {
            this.open()
          }
          event.preventDefault()
          break
      }
    })

    this.gameObject.addEventListener('openContainer', event => {
      this.open(event.detail.container)
    })
  }

  open(container) {
    this.isOpen = true
    if (container) this.lookingIn = container
    this.updateInventoryUi()
  }

  close() {
    this.isOpen = false
    if (this.lookingIn) {
      this.lookingIn = null
    }
    this.updateInventoryUi()
  }

  updateInventoryUi() {
    const playerTab = $('.tab-player')
    playerTab.innerHTML = ''
    this.items.forEach(item => {
      const row = document.createElement('div')
      row.classList.add('row')
      if (this.equipped === item) {
        row.classList.add('highlight')
      }
      row.innerText = item.name
      row.addEventListener('click', () => {
        if (this.lookingIn) {
          // TODO: Equip system
          // if (this.equipped === item) {
          //   this.unequip()
          // }
          this.remove(item)
          this.lookingIn.add(item)
          this.updateInventoryUi()
        }
      })
      const button = document.createElement('button')
      button.classList.add('button')
      button.innerText = item.useName
      if (this.equipped === item) {
        button.innerText = 'Unequip'
      }
      button.addEventListener('click', event => {
        event.stopPropagation()
        if (item.use(this)) {
          this.remove(item)
          // TODO: Consuming items
          // this.lastEaten = this.game.timestamp
        }
        this.updateInventoryUi()
      })
      row.append(button)
      playerTab.append(row)
    })

    if (this.lookingIn) {
      const containerTab = $('.tab-container')
      containerTab.innerHTML = ''
      this.lookingIn.items.forEach(item => {
        const row = document.createElement('div')
        row.classList.add('row')
        row.innerText = item.name
        row.addEventListener('click', event => {
          event.stopPropagation()
          this.lookingIn.remove(item)
          this.add(item)
          this.updateInventoryUi()
        })
        containerTab.append(row)
      })
    }

    $('.tab-container').setAttribute('aria-hidden', !this.lookingIn)
    $('.inventory').setAttribute('aria-hidden', !this.isOpen)
  }
}
