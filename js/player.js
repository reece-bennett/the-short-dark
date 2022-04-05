import { $, angleBetween, createDiv, distanceBetween, lerp, unlerp } from './util.js'
import Creature from './creature.js'
import Item from './item.js'
import { intersect } from './collision.js'

export default class Player extends Creature {
  inventory = [Item.waterBottle(), Item.beefJerky()]
  inventoryOpen = false
  lookingIn
  equipped

  collider = {
    type: 'box',
    halfWidth: 7,
    halfHeight: 7,
  }
  spawnCollider = this.collider

  // Stats in percentages
  energy = 1
  food = 1
  water = 1
  lastTimeCheckedNearby = 0
  lastHeal = 0
  lastEaten = 0
  lastHungerDamage = 0
  lastThirstDamage = 0
  lastTrackPlaced = 0
  lastTrackLeft = false

  constructor(game, x, y) {
    super({
      game,
      name: 'player',
      x,
      y,
      hitPoints: 20,
      spriteXml: `
        <sprite>
          <leftarm/>
          <rightarm/>
          <body/>
          <head/>
          <item/>
        </sprite>
      `,
    })

    const bar = createDiv(this.objectElement, 'bar')
    createDiv(bar, 'reload')
  }

  updateNearbyInteractiveObject() {
    const nearbyRadius = 40

    const nearbyInteractiveObjects = this.game.objects
      .filter(object => object.interactive)
      .filter(object => this.distanceTo(object.x, object.y) < nearbyRadius)

    if (nearbyInteractiveObjects.length === 0) {
      if (this.closestInteractiveObject) {
        this.closestInteractiveObject.objectElement.classList.remove('target')
        this.closestInteractiveObject.untarget?.()
        this.closestInteractiveObject = undefined
      }

      return
    }

    const closestInteractiveObject = nearbyInteractiveObjects
      .reduce((curr, acc) => this.distanceTo(curr.x, curr.y) < this.distanceTo(acc.x, acc.y) ? curr : acc)

    if (closestInteractiveObject !== this.closestInteractiveObject) {
      if (this.closestInteractiveObject) {
        this.closestInteractiveObject.objectElement.classList.remove('target')
        this.closestInteractiveObject.untarget?.()
      }

      this.closestInteractiveObject = closestInteractiveObject
      this.closestInteractiveObject.objectElement.classList.add('target')
    }
  }

  update(dt) {
    super.update(dt)

    let vx = 0
    let vy = 0

    if (this.game.keyDown.has('KeyW')) vy--
    if (this.game.keyDown.has('KeyD')) vx++
    if (this.game.keyDown.has('KeyS')) vy++
    if (this.game.keyDown.has('KeyA')) vx--

    // Normalise
    const length = Math.sqrt(vx * vx + vy * vy)
    if (length > 0) {
      vx /= length
      vy /= length

      this.isSprinting = this.game.keyDown.has('ShiftLeft')

      // Adjust for player speed and delta
      const speed = this.isSprinting ? 120 : 60
      vx *= speed * dt
      vy *= speed * dt

      const prevX = this.x
      const prevY = this.y

      this.x += vx
      this.y += vy

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

      // this.energy -= (this.isSprinting ? 0.05 : 0.02) * dt

      // Tracks
      if (this.game.timestamp - this.lastTrackPlaced > (this.isSprinting ? 300 : 500)) {
        const len = this.lastTrackLeft ? 3 : -3
        const a = Math.PI / 2 - this.rotation
        const dx = len * Math.sin(a)
        const dy = len * Math.cos(a)
        this.game.tracks.add(this.x + dx, this.y + dy, 6)
        this.lastTrackPlaced = this.game.timestamp
        this.lastTrackLeft = !this.lastTrackLeft
      }
    }

    // Update camera
    this.game.camera.x = this.x - window.innerWidth / 2
    this.game.camera.y = this.y - window.innerHeight / 2

    if (this.game.keyPressed.has('Tab')) {
      if (this.inventoryOpen) {
        this.closeInventory()
      } else {
        this.openInventory()
      }
    }

    if (this.game.keyPressed.has('KeyE') && this.closestInteractiveObject) {
      this.closestInteractiveObject.use()
    }

    if (this.game.timestamp - this.lastTimeCheckedNearby > 100) {
      this.updateNearbyInteractiveObject()
      this.lastTimeCheckedNearby = this.game.timestamp
    }

    if (this.inventoryOpen && this.game.keyPressed.has('Escape')) {
      this.closeInventory()
    }

    if (this.game.keyPressed.has('KeyP')) {
      this.doDamage(1)
    }

    this.updateTemperature(dt, this.temperature.ambient)
    // this.energy -= 0.004 * dt
    this.food = Math.max(this.food - (this.isSprinting ? 0.008 : 0.002) * dt, 0)
    this.water = Math.max(this.water - (this.isSprinting ? 0.02 : 0.006) * dt, 0)

    if (this.hitPoints <= 0) {
      this.game.running = false
      $('.gameover').setAttribute('aria-hidden', false)
      const secondsLived = this.game.duration / 1000
      $('.time-minutes').innerText = Math.floor(secondsLived / 60)
      $('.time-seconds').innerText = Math.round(secondsLived % 60)
    }

    // Rotate to face the cursor
    this.rotation = angleBetween(
      this.x - this.game.camera.x,
      this.y - this.game.camera.y,
      this.game.mouse.x,
      this.game.mouse.y)

    // Heal using hunger
    if (this.food > 0
      && this.hitPoints < 20
      && this.game.timestamp - this.lastDamage > 10000
      && this.game.timestamp - this.lastEaten > 10000
      && this.game.timestamp - this.lastHeal > 1000) {
      this.hitPoints += 1
      this.food = Math.max(this.food - 0.05, 0)
      this.lastHeal = this.game.timestamp
    }

    // console.log(this.food, this.water)
    if (this.food === 0 && this.game.timestamp - this.lastHungerDamage > 1000) {
      this.doDamage(1)
      this.lastHungerDamage = this.game.timestamp
      $('.death-message').innerText = 'You died of starvation'
    }
    if (this.water === 0 && this.game.timestamp - this.lastThirstDamage > 1000) {
      this.doDamage(1)
      this.lastThirstDamage = this.game.timestamp
      $('.death-message').innerText = 'You were very, very thirsty'
    }
  }

  draw() {
    super.draw()
    $('.game').style.transform = `translate(${-this.game.camera.x}px, ${-this.game.camera.y}px)`
    $('.inventory').setAttribute('aria-hidden', !this.inventoryOpen)
    this.updateStatsUi()
  }

  openInventory(container) {
    console.log(`Inventory opened${container ? ' with container' : ''}`)
    this.inventoryOpen = true
    if (container) this.lookingIn = container
    this.updateInventoryUi()
  }

  closeInventory() {
    console.log('Inventory closed')
    this.inventoryOpen = false
    if (this.lookingIn) {
      this.lookingIn.close()
      this.lookingIn = undefined
    }
  }

  updateInventoryUi() {
    const playerTab = $('.tab-player')
    playerTab.innerHTML = ''
    this.inventory.forEach((item, index) => {
      const row = document.createElement('div')
      row.classList.add('row')
      if (this.equipped === item) {
        row.classList.add('highlight')
      }
      row.innerText = item.name
      row.addEventListener('click', () => {
        if (this.lookingIn) {
          if (this.equipped === item) {
            this.unequip()
          }
          this.removeFromInventory(index)
          this.lookingIn.addToInventory(item)
        }
      })
      row.addEventListener('contextmenu', event => {
        event.preventDefault()
        if (item.use(this)) {
          this.inventory.splice(this.inventory.indexOf(item), 1)
          this.lastEaten = this.game.timestamp
        }
        this.updateInventoryUi()
      })
      playerTab.append(row)
    })
  }

  updateStatsUi() {
    // console.log(this.temperature.current)
    $('.progress.health').style.setProperty('--p', `${this.hitPoints * 5}%`)
    $('.progress.health').style.setProperty('--spread', `${lerp(0, -12, Math.min(this.hitPoints * 0.1, 1))}px`)
    const tempAsPercent = unlerp(this.temperature.tooCold, 20, this.temperature.current)
    $('.progress.temperature').style.setProperty('--p', `${tempAsPercent * 100}%`)
    $('.progress.temperature').style.outline = this.freezing ? '2px solid lightblue' : ''
    // $('.progress.energy').style.setProperty('--p', `${this.energy * 100}%`)
    $('.progress.food').style.setProperty('--p', `${this.food * 100}%`)
    $('.progress.food').style.setProperty('--spread', `${lerp(0, -12, Math.min(this.food * 2, 1))}px`)
    $('.progress.water').style.setProperty('--p', `${this.water * 100}%`)
    $('.progress.water').style.setProperty('--spread', `${lerp(0, -12, Math.min(this.water * 2, 1))}px`)
  }

  addToInventory(item) {
    this.inventory.push(item)
    this.updateInventoryUi()
  }

  removeFromInventory(index) {
    const item = this.inventory.splice(index, 1)
    this.updateInventoryUi()
    return item
  }

  distanceTo(x, y) {
    return distanceBetween(x, y, this.x, this.y)
  }

  toggleEquipped(item) {
    if (this.equipped === item) {
      this.unequip()
    } else {
      this.equip(item)
    }
  }

  equip(item) {
    if (this.equipped) {
      this.objectElement.classList.remove(this.equipped.name.toLowerCase().replace(' ', '-'))
    }
    this.objectElement.classList.add(item.name.toLowerCase().replace(' ', '-'))
    this.equipped = item
  }

  unequip() {
    this.objectElement.classList.remove(this.equipped.name.toLowerCase().replace(' ', '-'))
    this.equipped = undefined
  }
}
