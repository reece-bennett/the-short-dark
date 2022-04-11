import Component from './component.js'
import Vec2 from './vec2.js'

export default class FollowMouse extends Component {
  constructor(params) {
    super(params)
    this.mouse = new Vec2()
  }

  create() {
    super.create()

    this.camera = this.gameObject.getGameObject('/Camera')

    document.addEventListener('mousemove', event => {
      this.mouse.set(event.clientX, event.clientY)
    })
  }

  update(dt) {
    super.update(dt)
    this.gameObject.rotation = this.gameObject.position.subtract(this.camera.position).angleTo(this.mouse)
  }
}
