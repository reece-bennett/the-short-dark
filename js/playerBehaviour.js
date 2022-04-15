import Component from './component.js'

export default class PlayerBehaviour extends Component {
  constructor(params) {
    super(params)
    this.interactionRadius = null
    this.interactables = []
    this.target = null
  }

  create() {
    this.interactionRadius = this.gameObject.getGameObject('InteractionRadius')

    this.interactionRadius.addEventListener('triggerEntered', event => {
      this.interactables.push(event.detail.otherCollider.gameObject)
    })
    this.interactionRadius.addEventListener('triggerExited', event => {
      this.interactables.splice(this.interactables.indexOf(event.detail.otherCollider.gameObject), 1)
    })

    // Not happy with having a key listener here (would like to keep in input.js)
    // but seems easiest way?
    document.addEventListener('keydown', event => {
      if (event.code === 'KeyE') {
        console.log(this.target)
        // Interact with the target
      }
    })
  }

  update(dt) {
    super.update(dt)
    this.updateTarget()
  }

  updateTarget() {
    const closest = this.interactables
      .reduce((prevClosest, curr) => {
        if (!prevClosest) return curr

        return this.gameObject.distanceTo(curr) < this.gameObject.distanceTo(prevClosest) ? curr : prevClosest
      }, null)

    if (this.target !== closest) {
      this.target?.getComponent('Sprite').removeClass('target')
      closest?.getComponent('Sprite').addClass('target')
      this.target = closest
    }
  }
}
