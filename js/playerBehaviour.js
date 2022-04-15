import Component from './component.js'
import { $ } from './util.js'

export default class PlayerBehaviour extends Component {
  constructor(params) {
    super(params)
    this.interactionRadius = null
    this.interactables = []
    this.target = null
    this.inventory = []
    this.inventoryOpen = false
    this.lookingIn = null
  }

  create() {
    this.interactionRadius = this.gameObject.getGameObject('InteractionRadius')

    this.interactionRadius.addEventListener('triggerEntered', event => {
      this.interactables.push(event.detail.otherCollider.gameObject)
    })
    this.interactionRadius.addEventListener('triggerExited', event => {
      this.interactables.splice(this.interactables.indexOf(event.detail.otherCollider.gameObject), 1)
    })

    // Not happy with having a key listener here (would like to keep in input.js)
    // but seems easiest way?
    document.addEventListener('keydown', event => {
      switch (event.code) {
        case 'KeyE':
          this.target.dispatchEvent(new CustomEvent('interact', { detail: { player: this.gameObject } }))
          break
        case 'Tab':
          if (this.inventoryOpen) {
            this.closeInventory()
          } else {
            this.openInventory()
          }
          event.preventDefault()
          break
      }
    })

    this.gameObject.addEventListener('openContainer', event => {
      this.openInventory(event.detail.container)
    })

    this.gameObject.addEventListener('addItem', event => {
      this.addToInventory(event.detail.item)
    })
  }

  update(dt) {
    super.update(dt)
    this.updateTarget()
  }

  updateTarget() {
    const closest = this.interactables.reduce((prevClosest, curr) => {
      if (!prevClosest) return curr
      return this.gameObject.distanceTo(curr) < this.gameObject.distanceTo(prevClosest) ? curr : prevClosest
    }, null)

    if (this.target !== closest) {
      this.target?.getComponent('Sprite').removeClass('target')
      closest?.getComponent('Sprite').addClass('target')
      this.target = closest
    }
  }

  // TODO: This inventory stuff should be in an inventory component along with
  // the duplicated stuff in container.js?
  addToInventory(item) {
    this.inventory.push(item)
    this.updateInventoryUi()
  }

  removeFromInventory(index) {
    const item = this.inventory.splice(index, 1)
    this.updateInventoryUi()
    return item
  }

  openInventory(container) {
    this.inventoryOpen = true
    if (container) this.lookingIn = container
    this.updateInventoryUi()
  }

  closeInventory() {
    this.inventoryOpen = false
    if (this.lookingIn) {
      this.lookingIn = undefined
    }
    this.updateInventoryUi()
  }

  updateInventoryUi() {
    const playerTab = $('.tab-player')
    playerTab.innerHTML = ''
    this.inventory.forEach((item, index) => {
      const row = document.createElement('div')
      row.classList.add('row')
      if (this.equipped === item) {
        row.classList.add('highlight')
      }
      row.innerText = item.name
      row.addEventListener('click', () => {
        if (this.lookingIn) {
          if (this.equipped === item) {
            this.unequip()
          }
          this.removeFromInventory(index)
          this.lookingIn.dispatchEvent(new CustomEvent('addItem', { detail: { item } }))
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
          this.inventory.splice(this.inventory.indexOf(item), 1)
          this.lastEaten = this.game.timestamp
        }
        this.updateInventoryUi()
      })
      row.append(button)
      playerTab.append(row)
    })
    $('.tab-container').setAttribute('aria-hidden', !this.lookingIn)
    $('.inventory').setAttribute('aria-hidden', !this.inventoryOpen)
  }
}
