// import Item from '../item.js'

function addClamped(stat, amount) {
  return Math.max(Math.min(stat + amount, 1), 0)
}

export const waterBottle = {
  className: 'water-bottle',
  name: 'Water bottle',
  description: 'Sip sip',
  action: 'Drink',
  use: player => {
    player.water = addClamped(player.water, 0.25)
    return true
  }
}
