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

  add(item) {
    // TODO: figure out columns and rows for this item?
    this.items.push(item)
    item.inventory = this
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1)
  }

  removeAtIndex(index) {
    return this.items.splice(index, 1)
  }
}
