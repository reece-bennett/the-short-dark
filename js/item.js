function addClamped(stat, amount) {
  return Math.max(Math.min(stat + amount, 1), 0)
}

export default class Item {
  constructor(name, use) {
    this.name = name
    this.use = use
  }

  static waterBottle() {
    return new Item('Water bottle', player => player.water = addClamped(player.water, 0.25))
  }

  static cola() {
    return new Item('Can of cola', player => {
      player.food = addClamped(player.food, 0.1)
      player.water = addClamped(player.water, 0.25)
    })
  }

  static beefJerky() {
    return new Item('Beef jerkey', player => {
      player.food = addClamped(player.food, 0.3)
      player.water = addClamped(player.water, -0.1)
    })
  }

  static energyBar() {
    return new Item('Energy bar', player => player.food = addClamped(player.food, 0.5))
  }

  static coffee() {
    return new Item('Cup of coffee', player => {
      player.energy = addClamped(player.energy, 0.1)
      player.water = addClamped(player.water, 0.2)
    })
  }
}
