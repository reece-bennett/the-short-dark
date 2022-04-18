import Item from '../item.js'

export default class WaterBottle extends Item {
  constructor() {
    super({
      className: 'water-bottle',
      name: 'Water bottle',
      description: 'Sip sip',
      action: 'Drink',
      consumable: true,
      stats: {
        water: 0.25,
      },
    })
  }
}

