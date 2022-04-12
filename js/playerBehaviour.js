import Component from './component.js'

export default class PlayerBehaviour extends Component {
  constructor(params) {
    super(params)
  }

  create() {
    this.gameObject.addEventListener('collisionStart', event => {
      if (event.detail.otherCollider.gameObject.name === 'Interaction radius') {
        console.log('Entered')
      }
    })
    this.gameObject.addEventListener('collisionEnd', event => {
      if (event.detail.otherCollider.gameObject.name === 'Interaction radius') {
        console.log('Exited')
      }
    })
  }

  // Listen for collision events, add to 'interactables'
  // Listen to interact event, if 'interactables' choose the closest one and open it
}
