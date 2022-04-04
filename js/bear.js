import { intersect } from './collision.js'
import Creature from './creature.js'
import { $, angleBetween, createDiv, distanceBetween, randomXY } from './util.js'

export default class Bear extends Creature {
  collider = {
    type: 'circle',
    radius: 19
  }
  spawnCollider = this.collider
  speed = 20
  anger = 0
  isAngry = false
  lastAttacked = 0

  constructor({ game, x, y }) {
    super({
      game,
      name: 'bear',
      x,
      y,
      width: 20,
      height: 30,
      hitPoints: 40,
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

    const bar = createDiv(this.objectElement, 'bar')
    createDiv(bar, 'health')

    this.pickNewGoal()
  }

  update(dt) {
    super.update(dt)

    // See how close the player is, get annoyed if they are close
    const distanceToPlayer = distanceBetween(this.x, this.y, this.game.player.x, this.game.player.y)
    const maxChange = 1
    const maxDistance = 400
    const change = (maxChange - (maxChange / maxDistance) * distanceToPlayer) * dt
    this.anger = Math.min(Math.max(this.anger + change, 0), 1)
    // console.log(change, this.anger)

    const prevX = this.x
    const prevY = this.y

    // Turn and walk toward goal
    this.rotation = angleBetween(this.x, this.y, this.goal.x, this.goal.y)
    this.x += this.speed * Math.sin(this.rotation) * dt
    this.y -= this.speed * Math.cos(this.rotation) * dt

    if (this.isAngry) {
      if (this.anger === 0) {
        // Stop being angry and go back to roaming
        this.isAngry = false
        this.speed = 20
        this.pickNewGoal()
      }

      // Chase the player
      this.goal.x = this.game.player.x
      this.goal.y = this.game.player.y

      if (this.game.timestamp - this.lastAttacked > 1000 && intersect(this, this.game.player)) {
        this.game.player.doDamage(5)
        this.lastAttacked = this.game.timestamp
        $('.death-message').innerText = 'You were eaten by a bear, oh no :('
      }

      this.game.objects.forEach(other => {
        if (this === other) return

        if (intersect(this, other)) {
          if (!intersect({...this, y: prevY}, other)) {
            this.y = prevY
          } else if (!intersect({...this, x: prevX}, other)) {
            this.x = prevX
          } else {
            this.x = prevX
            this.y = prevY
          }
        }
      })

      // for (const other of this.game.objects) {
      //   if (other !== this && intersect(this, other)) {
      //     this.x = prevX
      //     this.y = prevY
      //     break
      //   }
      // }
    } else {
      if (this.anger === 1) {
        this.isAngry = true
        this.speed = 65
      }

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
  }

  pickNewGoal() {
    // Pick random point up to X distance away
    this.goal = randomXY(500)
    this.goal.x += this.x
    this.goal.y += this.y
  }

  doDamage(amount) {
    super.doDamage(amount)
    this.objectElement.querySelector('.health').style.width = `${Math.min(this.hitPoints * 2.5 + 5, 100)}%`
  }
}
