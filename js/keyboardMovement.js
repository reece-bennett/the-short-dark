import Component from './component.js'
import Input from './input.js'
import Vec2 from './vec2.js'

export default class KeyboardMovement extends Component {
  constructor(params) {
    super(params)
    this.velocity = new Vec2()
  }

  create() {
    super.create()
    this.camera = this.gameObject.getGameObject('/Camera')
  }

  update(dt) {
    super.update(dt)

    this.velocity.set(0, 0)

    if (Input.isKeyDown('KeyW')) this.velocity.y--
    if (Input.isKeyDown('KeyD')) this.velocity.x++
    if (Input.isKeyDown('KeyS')) this.velocity.y++
    if (Input.isKeyDown('KeyA')) this.velocity.x--

    this.velocity = this.velocity.normalise().multiply(dt * 100)
    this.gameObject.position = this.gameObject.position.add(this.velocity)

    // Update camera
    this.camera.position.set(this.gameObject.position.x - window.innerWidth / 2, this.gameObject.position.y - window.innerHeight / 2)
  }
}
