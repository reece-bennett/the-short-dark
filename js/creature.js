import Object from './object.js'

export default class Creature extends Object {
  isSprinting = false
  temperature = {
    current: 20,
    tooCold: 10,
    tooHot: 35,
    coolRate: 0.002,
    heatRate: 0.004,
    buffer: 4
  }

  constructor({game, name, x, y, width, height, spriteXml, stats}) {
    super({
      game,
      name,
      x,
      y,
      width,
      height,
      spriteXml,
    })

    this.stats = stats
  }

  updateTemperature(dt, ambient) {
    if (ambient < this.temperature.current - this.temperature.buffer) {
      this.temperature.current = this.temperature.current - ((this.temperature.current - ambient) * this.temperature.coolRate * dt)
    }

    if (ambient > this.temperature.current) {
      this.temperature.current = this.temperature.current + ((ambient - this.temperature.current) * this.temperature.heatRate * dt)
    }

    if (this.temperature.current < this.temperature.tooCold) {
      // take cold damage?
    }

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
  }
}
