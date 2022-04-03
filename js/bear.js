import { intersect } from './collision.js'
import Creature from './creature.js'
import { angleBetween, distanceBetween, randomXY } from './util.js'

export default class Bear extends Creature {
  collider = {
    type: 'circle',
    radius: 18
  }
  spawnCollider = this.collider
  speed = 20
  anger = 0

  constructor({ game, x, y }) {
    super({
      game,
      name: 'bear',
      x,
      y,
      width: 20,
      height: 30,
      spriteXml: `
        <sprite>
          <tail></tail>
          <body></body>
          <head>
            <nose></nose>
            <ear></ear>
            <ear></ear>
          </head>
        </sprite>
      `
    })

    this.pickNewGoal()
  }

  update(dt) {
    super.update(dt)

    // Turn and walk toward goal
    this.rotation = angleBetween(this.x, this.y, this.goal.x, this.goal.y)
    this.x += this.speed * Math.sin(this.rotation) * dt
    this.y -= this.speed * Math.cos(this.rotation) * dt

    // Pick a new goal when reached
    if (distanceBetween(this.x, this.y, this.goal.x, this.goal.y) < 10) {
      this.pickNewGoal()
    }

    // Pick a new goal if we bump into something
    for (const other of this.game.objects) {
      if (other !== this && intersect(this, other)) {
        this.pickNewGoal()
        break
      }
    }
  }

  pickNewGoal() {
    // Pick random point up to X distance away
    this.goal = randomXY(500)
    this.goal.x += this.x
    this.goal.y += this.y
  }
}
