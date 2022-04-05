import { intersect } from './collision.js'
import Object from './object.js'
import Creature from './creature.js'

export default class Bullet extends Object {
  speed = 1500

  constructor({ game, x, y, rotation, damage }) {
    super({
      name: 'bullet',
      game,
      x,
      y,
      width: 4,
      height: 12,
      rotation,
      spriteXml: '<sprite></sprite>'
    })

    this.damage = damage

    this.spawnCollider = this.collider = {
      type: 'circle',
      radius: 10
    }
  }

  update(dt) {
    this.x += this.speed * Math.sin(this.rotation) * dt
    this.y -= this.speed * Math.cos(this.rotation) * dt

    for (const other of this.game.objects) {
      if (other !== this && other !== this.game.player && intersect(this, other)) {
        // console.log('Bang')
        this.kill()
        if (other instanceof Creature) {
          other.doDamage(this.damage)
        }
        break
      }
    }
  }
}
