import Object from './object.js'

export default class Creature extends Object {
  isSprinting = false
  temperature = {
    current: 20,
    tooCold: 15,
    tooHot: 35,
    coolRate: 0.01,
    heatRate: 0.02,
    buffer: 4
  }
  freezingDamageCooldown = 3 // How many seconds between freezing damage
  freezing = false

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
    if (ambient < this.temperature.current - this.temperature.buffer) {
      const bufferedTempDiff = this.temperature.current - this.temperature.buffer - ambient
      this.temperature.current = this.temperature.current - (bufferedTempDiff * this.temperature.coolRate * dt)
    }

    if (ambient > this.temperature.current) {
      const tempDiff = this.temperature.current - ambient
      this.temperature.current = this.temperature.current + (tempDiff * this.temperature.heatRate * dt)
    }

    this.freezing = this.temperature.current < this.temperature.tooCold

    if (this.temperature.current > this.temperature.tooHot) {
      // take heat damage?
    }
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

    if (this.freezing && this.freezingDamageCooldown === 0) {
      this.hitPoints -= 1
      console.log(this.hitPoints)
      this.freezingDamageCooldown = 1
    }

    this.freezingDamageCooldown = Math.max(0, this.freezingDamageCooldown - dt)
  }
}
