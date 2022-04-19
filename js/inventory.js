import Component from './component.js'

export default class Inventory extends Component {
  constructor({ items = [], columns, rows, ...params }) {
    super(params)
    // TODO: Use the cols & rows variables to set CSS vars?
    this.columns = columns ?? 2
    this.rows = rows ?? 5
    this.items = []

    for (let i = 0; i < this.columns * this.rows; i++) {
      if (items[i]) {
        this.items.push(items[i])
        items[i].inventory = this
      } else {
        this.items.push(null)
      }
    }
  }

  create() {
    this.gameObject.addEventListener('addItem', event => {
      this.add(event.detail.item)
    })
  }

  add(item) {
    // TODO: Check if there's enough space for multi-cell items
    const firstEmptyIndex = this.items.indexOf(null)

    if (firstEmptyIndex === -1) {
      // TODO: Show some sort of 'no inventory space left' message
      return false
    }

    item.inventory = this
    this.items[firstEmptyIndex] = item
  }

  remove(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === item) {
        this.items[i].inventory = null // This item no longer belongs to this inventory
        this.items[i] = null // Reset this spot in the inventories item array
      }
    }
  }
}
