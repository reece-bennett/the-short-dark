function addClamped(stat, amount) {
  return Math.max(Math.min(stat + amount, 1), 0)
}

export default class Item {
  constructor(name, use) {
    this.name = name
    // What to do when item is right clicked, return true if should be removed
    // from inventory on use
    this.use = use
  }

  static waterBottle() {
    return new Item('Water bottle', player => {
      player.water = addClamped(player.water, 0.25)
      return true
    })
  }

  static cola() {
    return new Item('Can of cola', player => {
      player.food = addClamped(player.food, 0.1)
      player.water = addClamped(player.water, 0.25)
      return true
    })
  }

  static beefJerky() {
    return new Item('Beef jerkey', player => {
      player.food = addClamped(player.food, 0.3)
      player.water = addClamped(player.water, -0.1)
      return true
    })
  }

  static energyBar() {
    return new Item('Energy bar', player => {
      player.food = addClamped(player.food, 0.5)
      return true
    })
  }

  static coffee() {
    return new Item('Cup of coffee', player => {
      player.energy = addClamped(player.energy, 0.1)
      player.water = addClamped(player.water, 0.2)
      return true
    })
  }

  static rifle() {
    const rifle = new Item('Rifle')
    rifle.use = player => {
      player.toggleEquipped(rifle)
      return false
    }
    return rifle
  }

  static revolver() {
    const revolver = new Item('Revolver')
    revolver.use = player => {
      player.toggleEquipped(revolver)
      return false
    }
    return revolver
  }
}
