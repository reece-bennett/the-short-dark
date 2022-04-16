import Inventory from './inventory.js'

export default class Container extends Inventory {
  create() {
    this.gameObject.addEventListener('interact', event => {
      event.detail.player.dispatchEvent(new CustomEvent('openContainer', { detail: { container: this }}))
    })
  }
}
