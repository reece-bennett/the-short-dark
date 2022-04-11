export default class Component {
  constructor({ name }) {
    this.name = name ?? this.constructor.name
    this.gameObject = null
  }

  create() {}

  update() {}

  lateUpdate() {}

  draw() {}

  destroy() {}
}
