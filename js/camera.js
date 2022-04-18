import Component from './component.js'
import { $ } from './util.js'

export default class Camera extends Component {
  constructor(params) {
    super(params)
  }

  draw() {
    super.draw()
    $('.world').style.transform = `translate(${-this.gameObject.position.x}px, ${-this.gameObject.position.y}px)`
  }
}
