import Component from './component.js'

export default class Door extends Component {
  constructor(params) {
    super(params)
    this.isOpen = false
    this.body = null
  }

  create() {
    this.body = this.gameObject.getComponent('Body')
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
    this.gameObject.rotation = -Math.PI / 2
    this.body.layer = 2
  }

  close() {
    this.isOpen = false
    this.gameObject.rotation = 0
    this.body.layer = 3
  }
}
