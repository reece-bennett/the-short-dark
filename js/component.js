export default class Component {
  constructor({ name }) {
    this.name = name ?? 'Unnamed component'
    this.gameObject = null
  }

  create() {}

  update() {}

  lateUpdate() {}

  draw() {}

  destroy() {}
}
