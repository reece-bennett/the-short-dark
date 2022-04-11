import Component from './component.js'
import Vec2 from './vec2.js'

// TODO: This class is crap, there should be a global keyboard input thing and
// this class becomes more of a player 'controller' that just says what inputs
// do what to the player
export default class Input extends Component {
  constructor(params) {
    super(params)
    this.keyDown = new Set()
    this.keyPressed = new Set()
    this.velocity = new Vec2()
  }

  create() {
    super.create()

    this.camera = this.gameObject.getGameObject('/Camera')

    document.addEventListener('keydown', event => {
      this.keyDown.add(event.code)
      this.keyPressed.add(event.code)
    })

    document.addEventListener('keyup', event => {
      this.keyDown.delete(event.code)
    })
  }

  update(dt) {
    super.update(dt)

    this.keyPressed.clear()

    this.velocity.set(0, 0)

    if (this.keyDown.has('KeyW')) this.velocity.y--
    if (this.keyDown.has('KeyD')) this.velocity.x++
    if (this.keyDown.has('KeyS')) this.velocity.y++
    if (this.keyDown.has('KeyA')) this.velocity.x--

    this.velocity = this.velocity.normalise().multiply(dt * 100)

    this.gameObject.position = this.gameObject.position.add(this.velocity)

    // Update camera
    this.camera.position.set(this.gameObject.position.x - window.innerWidth / 2, this.gameObject.position.y - window.innerHeight / 2)
  }
}
