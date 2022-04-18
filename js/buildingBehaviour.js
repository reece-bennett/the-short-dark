import Component from './component.js'

export default class BuildingBehaviour extends Component {
  constructor(params) {
    super(params)
    this.interactionArea = null
    this.sprite = null
  }

  create() {
    this.interactionArea = this.gameObject.getGameObject('InteractionArea')
    this.sprite = this.gameObject.getComponent('Sprite')

    this.interactionArea.addEventListener('triggerEntered', () => {
      this.sprite.addClass('player-inside')
    })
    this.interactionArea.addEventListener('triggerExited', () => {
      this.sprite.removeClass('player-inside')
    })
  }
}
