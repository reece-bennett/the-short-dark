import Component from './component.js'

export default class PlayerBehaviour extends Component {
  constructor(params) {
    super(params)
    this.interactionRadius = null
    this.interactables = []
  }

  create() {
    this.interactionRadius = this.gameObject.getGameObject('InteractionRadius')

    this.interactionRadius.addEventListener('triggerEntered', event => {
      this.interactables.push(event.detail.otherCollider.gameObject)
      console.log(this.interactables)
    })
    this.interactionRadius.addEventListener('triggerExited', event => {
      this.interactables.splice(this.interactables.indexOf(event.detail.otherCollider.gameObject))
      console.log(this.interactables)
    })
  }

  // Listen for collision events, add to 'interactables'
  // Listen to interact event, if 'interactables' choose the closest one and open it
}
