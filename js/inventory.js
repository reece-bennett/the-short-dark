import Component from './component.js'

export default class Inventory extends Component {
  constructor({ items, columns, rows, ...params }) {
    super(params)
    // TODO: Use the cols & rows variables to set CSS vars?
    this.columns = columns ?? 2
    this.rows = rows ?? 5
    this.items = items?.map((item, i) => {
      item.column = i % this.columns
      item.row = Math.floor(i / this.columns)
      item.inventory = this
      return item
    }) ?? []
  }

  create() {
    this.gameObject.addEventListener('addItem', event => {
      this.add(event.detail.item)
    })
  }

  hasRoomForItem() {
    // TODO: Take into account space for multi-cell items
    return this.items.length < this.columns * this.rows
  }

  getFirstEmptyCellLocation() {
    return [
      this.items.length % this.columns,
      Math.floor(this.items.length / this.columns)
    ]
  }

  add(item) {
    if (!this.hasRoomForItem(item)) {
      // TODO: Show some sort of 'no inventory space left' message
      return
    }

    [item.column, item.row] = this.getFirstEmptyCellLocation()
    item.inventory = this
    this.items.push(item)
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1)
  }

  removeAtIndex(index) {
    return this.items.splice(index, 1)
  }
}
