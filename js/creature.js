import Object from './object.js'
import { $ } from './util.js'

export default class Creature extends Object {
  isSprinting = false
  temperature = {
    current: 20,
    tooCold: -5,
    tooHot: 35,
    coolRate: 0.03,
    heatRate: 0.5,
    buffer: 4,
    ambient: -13 // Outside tempoerature
  }
  freezingDamageCooldown = 1000 // How many ms between freezing damage
  freezing = false
  lastFreezingDamage = 0
  lastDamage = 0

  constructor({game, name, x, y, width, height, spriteXml, hitPoints = 1}) {
    super({
      game,
      name,
      x,
      y,
      width,
      height,
      spriteXml,
    })

    this.hitPoints = hitPoints
  }

  updateTemperature(dt, ambient) {
    // if (ambient < this.temperature.current - this.temperature.buffer) {
    //   const bufferedTempDiff = this.temperature.current - this.temperature.buffer - ambient
    //   this.temperature.current = this.temperature.current - (bufferedTempDiff * this.temperature.coolRate * dt)
    // }

    // if (ambient > this.temperature.current) {
    //   const tempDiff = ambient - this.temperature.current
    //   this.temperature.current = this.temperature.current + (tempDiff * this.temperature.heatRate * dt)
    // }

    // this.freezing = this.temperature.current < this.temperature.tooCold

    // if (this.temperature.current > this.temperature.tooHot) {
    //   // take heat damage?
    // }

    let tempDiff = ambient - this.temperature.current
    tempDiff *= (ambient < this.temperature.current ? this.temperature.coolRate : this.temperature.heatRate)
    // console.log(ambient, this.temperature.current, tempDiff)
    this.temperature.current += tempDiff * dt
    this.freezing = this.temperature.current < this.temperature.tooCold
    // this.freezingSpeed = this.freezing ? unlerp(-20, this.temperature.tooCold, this.temperature.current) * 5000 : Infinity
    // console.log(this.freezingSpeed)
  }

  doCleverAiStuff() {
    // ...
  }

  growl() {
    // ...
  }

  update(dt) {
    super.update(dt)

    // Creature specific things like getting hungry at whatever rate the creature gets hungry

    if (this.freezing && this.game.timestamp - this.lastFreezingDamage > this.freezingDamageCooldown) {
      this.doDamage(1)
      // console.log(this.hitPoints)
      this.lastFreezingDamage = this.game.timestamp
      if (this === this.game.player) {
        $('.death-message').innerText = 'You froze to death'
      }
    }

    // this.freezingDamageCooldown = Math.max(0, this.freezingDamageCooldown - dt)

    if (this.hitPoints < 0) {
      this.kill()
    }
  }

  doDamage(amount) {
    this.hitPoints -= amount
    this.lastDamage = this.game.timestamp
  }
}
