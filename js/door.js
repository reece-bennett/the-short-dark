import Component from './component.js'
import Vec2 from './vec2.js'

export default class Door extends Component {
  constructor(params) {
    super(params)
    this.isOpen = false
    this.body = null
    this.collider = null
  }

  create() {
    this.body = this.gameObject.getComponent('Body')
    this.collider = this.gameObject.getComponent('BoxCollider')
    this.gameObject.addEventListener('interact', () => {
      if (this.isOpen) {
        this.close()
      } else {
        this.open()
      }
    })
  }

  open() {
    this.isOpen = true
    this.gameObject.rotation -= Math.PI * 0.5
    this.body.layer = 2
    // TODO: This is super hacky, would be nice to get a better way of rotating
    // the collider around a point
    switch(this.gameObject.rotation) {
      case Math.PI * -0.5: // Top
        this.collider.width = 8
        this.collider.height = 30
        this.collider.position = this.collider.position.add(new Vec2(-15, -15))
        break
      case 0: // Right
        this.collider.width = 30
        this.collider.height = 8
        this.collider.position = this.collider.position.add(new Vec2(15, -15))
        break
      case Math.PI * 0.5: // Bottom
        this.collider.width = 8
        this.collider.height = 30
        this.collider.position = this.collider.position.add(new Vec2(15, 15))
        break
      case Math.PI: // Left
        this.collider.width = 30
        this.collider.height = 8
        this.collider.position = this.collider.position.add(new Vec2(-15, 15))
        break
    }
  }

  close() {
    switch(this.gameObject.rotation) {
      case Math.PI * -0.5: // Top
        this.collider.width = 30
        this.collider.height = 8
        this.collider.position = this.collider.position.subtract(new Vec2(-15, -15))
        break
      case 0: // Right
        this.collider.width = 8
        this.collider.height = 30
        this.collider.position = this.collider.position.subtract(new Vec2(15, -15))
        break
      case Math.PI * 0.5: // Bottom
        this.collider.width = 30
        this.collider.height = 8
        this.collider.position = this.collider.position.subtract(new Vec2(15, 15))
        break
      case Math.PI: // Left
        this.collider.width = 8
        this.collider.height = 30
        this.collider.position = this.collider.position.subtract(new Vec2(-15, 15))
        break
    }
    this.isOpen = false
    this.gameObject.rotation += Math.PI * 0.5
    this.body.layer = 3
  }
}
