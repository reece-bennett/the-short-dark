import Vitals from './vitals.js'
import { $, lerp } from './util.js'

export default class PlayerVitals extends Vitals {
  constructor(params) {
    super(params)
  }

  takeDamage(amount, type) {
    super.takeDamage(amount)

    if (this.dead) {
      switch(type) {
        case 'hunger':
          $('.death-message').innerText = 'You died of starvation'
          break
        case 'thirst':
          $('.death-message').innerText = 'You were very, very thirsty'
          break
        default:
          $('.death-message').innerText = 'Unknown causes'
      }
    }
  }

  updateStatsUi() {
    // console.log(this.temperature.current)
    // $('.progress.health').style.setProperty('--p', `${this.hitPoints * 5}%`)
    // $('.progress.health').style.setProperty('--spread', `${lerp(0, -12, Math.min(this.hitPoints * 0.1, 1))}px`)
    // const tempAsPercent = unlerp(this.temperature.tooCold, 20, this.temperature.current)
    // $('.progress.temperature').style.setProperty('--p', `${tempAsPercent * 100}%`)
    // $('.progress.temperature').style.outline = this.freezing ? '2px solid lightblue' : ''
    // $('.progress.energy').style.setProperty('--p', `${this.energy * 100}%`)
    $('.progress.food').style.setProperty('--p', `${this.food.current * 100}%`)
    $('.progress.food').style.setProperty('--spread', `${lerp(0, -12, Math.min(this.food.current * 2, 1))}px`)
    $('.progress.water').style.setProperty('--p', `${this.water.current * 100}%`)
    $('.progress.water').style.setProperty('--spread', `${lerp(0, -12, Math.min(this.water.current * 2, 1))}px`)
  }

  update(dt) {
    super.update(dt)
    // this.food = Math.max(this.food - (this.isSprinting ? 0.008 : 0.002) * dt, 0)
    // this.water = Math.max(this.water - (this.isSprinting ? 0.02 : 0.006) * dt, 0)
    this.food.add(-0.002 * dt)
    this.water.add(-0.006 * dt)

    this.updateStatsUi()
  }
}
