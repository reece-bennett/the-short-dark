export default class Component {
  constructor({ name }) {
    this.name = name ?? 'Unnamed component'
    this.gameObject = null
  }

  create() {}

  update(dt) {}

  lastUpdate(dt) {}

  draw() {}

  destroy() {}
}
