import Component from './component.js'
import { $ } from './util.js'

export default class Camera extends Component {
  constructor() {
    super({ name: 'Camera' })
  }

  draw() {
    super.draw()
    $('.game').style.transform = `translate(${-this.gameObject.position.x}px, ${-this.gameObject.position.y}px)`
  }
}
