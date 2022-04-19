import Component from './component.js'

export default class BuildingBehaviour extends Component {
  constructor(params) {
    super(params)
    this.interactionArea = null
    this.sprite = null
    this.timeoutId = null
  }

  create() {
    this.interactionArea = this.gameObject.getGameObject('InteractionArea')
    this.sprite = this.gameObject.getComponent('Sprite')

    this.interactionArea.addEventListener('triggerEntered', () => {
      if (this.timeoutId) clearTimeout(this.timeoutId) // Stops funnies when quickly exiting then re-entering
      this.sprite.addClass('z-index-fix')
      this.sprite.addClass('player-inside')
    })
    this.interactionArea.addEventListener('triggerExited', () => {
      this.sprite.removeClass('player-inside')
      this.timeoutId = setTimeout(() => this.sprite.removeClass('z-index-fix'), 400)
    })
  }
}
