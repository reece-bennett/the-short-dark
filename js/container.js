import Component from './component.js'
import { $ } from './util.js'

export default class Container extends Component {
  constructor({ inventory, ...params }) {
    super(params)
    this.inventory = inventory ?? []
    this.player = null
  }

  create() {
    this.gameObject.addEventListener('interact', event => {
      this.updateInventoryUi()
      this.player = event.detail.player
      event.detail.player.dispatchEvent(new CustomEvent('openContainer', { detail: { container: this.gameObject }}))
    })

    this.gameObject.addEventListener('addItem', event => {
      this.addToInventory(event.detail.item)
    })
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
        this.player.dispatchEvent(new CustomEvent('addItem', { detail: { item }}))
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
