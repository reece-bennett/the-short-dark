import Component from './component.js'

export default class Vitals extends Component {
  constructor(stats) {
    super({name: 'Vitals'})

    for (const [stat, value] of Object.entries(stats)) {
      this[stat] = {
        max: value,
        current: value,
        add: (diff) => {
          this[stat].current = Math.max(0, Math.min(this[stat].current + diff, this[stat].max))
          return this[stat].current
        },
        toString: () => this.current,
      }
    }
  }

  takeDamage(amount) {
    this.hitPoints = Math.max(0, this.hitPoints.current - amount)
    this.lastDamageTimestamp = this.game.timestamp

    if (this.hitPoints === 0) {
      this.dead = true // TODO: Something when things die? Lose if it's the player?
    }
  }

  update() {
    const timestamp = this.gameObject.root().timestamp

    if (this.food === 0 && timestamp - this.lastHungerDamage > 1000) {
      this.doDamage(1, 'hunger')
      this.lastHungerDamage = timestamp
    }

    if (this.water === 0 && timestamp - this.lastThirstDamage > 1000) {
      this.doDamage(1, 'thirst')
      this.lastThirstDamage = timestamp
    }
  }
}
