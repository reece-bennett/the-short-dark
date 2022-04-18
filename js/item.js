// function addClamped(stat, amount) {
//   return Math.max(Math.min(stat + amount, 1), 0)
// }

export default class Item {
  constructor({ className, name, description, action, use }) {
    this.className = className
    this.name = name
    this.description = description
    this.action = action
    this.use = use
  }

  // static waterBottle() {
  //   return new Item('Water bottle', 'Drink', player => {
  //     player.water = addClamped(player.water, 0.25)
  //     return true
  //   })
  // }
  //
  // static cola() {
  //   return new Item('Can of cola', 'Drink', player => {
  //     player.food = addClamped(player.food, 0.1)
  //     player.water = addClamped(player.water, 0.25)
  //     return true
  //   })
  // }
  //
  // static beefJerky() {
  //   return new Item('Beef jerkey', 'Eat', player => {
  //     player.food = addClamped(player.food, 0.3)
  //     player.water = addClamped(player.water, -0.1)
  //     return true
  //   })
  // }
  //
  // static energyBar() {
  //   return new Item('Energy bar', 'Eat', player => {
  //     player.food = addClamped(player.food, 0.5)
  //     return true
  //   })
  // }
  //
  // static coffee() {
  //   return new Item('Cup of coffee', 'Drink', player => {
  //     player.energy = addClamped(player.energy, 0.1)
  //     player.water = addClamped(player.water, 0.2)
  //     return true
  //   })
  // }
  //
  // static rifle() {
  //   const rifle = new Item('Rifle', 'Equip')
  //   rifle.use = player => {
  //     player.toggleEquipped(rifle)
  //     return false
  //   }
  //   return rifle
  // }
  //
  // static revolver() {
  //   const revolver = new Item('Revolver', 'Equip')
  //   revolver.use = player => {
  //     player.toggleEquipped(revolver)
  //     return false
  //   }
  //   return revolver
  // }
  //
  // static waterItems = [this.waterBottle, this.cola, this.coffee]
  // static foodItems = [this.beefJerky, this.energyBar]
  //
  // static createLoot() {
  //   let items = []
  //   while (Math.random() < 0.7 && items.length < 4) {
  //     const r = Math.random()
  //     if (r < 0.2) {
  //       items.push(Math.random() < 0.5 ? this.revolver() : this.rifle())
  //     } else {
  //       items.push(Math.random() < 0.5
  //         ? this.choose(this.foodItems)()
  //         : this.choose(this.waterItems)()
  //       )
  //     }
  //   }
  //   return items
  // }
  //
  // static choose(items) {
  //   return items[Math.floor(Math.random() * items.length)]
  // }
}
