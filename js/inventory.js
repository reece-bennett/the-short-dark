import Component from './component.js'

export default class Inventory extends Component {
  constructor({ items, columns, rows, ...params }) {
    super(params)
    this.items = items ?? []
    this.columns = columns ?? 2
    this.rows = rows ?? 5
    // TODO: Use the cols & rows variables to set CSS vars?

    // Assign each item an initial column and row
    this.items.forEach((item, i) => {
      item.column = i % this.columns
      item.row = Math.floor(i / this.columns)
      console.log(item)
    })
  }

  create() {
    this.gameObject.addEventListener('addItem', event => {
      this.add(event.detail.item)
    })
  }

  add(item) {
    this.items.push(item)
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1)
  }

  removeAtIndex(index) {
    return this.items.splice(index, 1)
  }
}
