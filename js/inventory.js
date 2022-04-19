import Component from './component.js'

export default class Inventory extends Component {
  constructor({ items = [], columns = 2, rows = 5, ...params }) {
    super(params)
    // TODO: Use the cols & rows variables to set CSS vars?
    this.columns = columns
    this.rows = rows
    items.forEach(item => item.inventory = this)
    this.items = items.concat(Array(this.columns * this.rows - items.length).fill(null))
  }

  create() {
    this.gameObject.addEventListener('addItem', event => {
      this.add(event.detail.item)
    })
  }

  // TODO: Check if there's enough space for multi-cell items
  hasRoomFor() {
    return this.items.indexOf(null) !== -1
  }

  add(item) {
    item.inventory = this
    this.items[this.items.indexOf(null)] = item // Assumes there is room
  }

  remove(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === item) {
        item.inventory = null // This item no longer belongs to this inventory
        this.items[i] = null // Reset this spot in this inventory item array
        // ...The removed item will be garbage collected if there's no other refs to it
      }
    }
  }
}
