import Component from './component.js'

export default class Inventory extends Component {
  constructor({ items, ...params }) {
    super(params)
    this.items = items ?? []
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
