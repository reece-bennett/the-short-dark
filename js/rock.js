export default class Rock extends Object {
  constructor({x, y, width, height}) {
    super({
      name: 'rock',
      x: x,
      y: y,
      width: width, // TODO: Random default rock size between sensible min/max
      height: height, // TODO: Random default rock size between sensible min/max
    })
  }

  // Text that is fetched if a player inspects the object
  static inspect = () => `It's just a ${this.name}.`
}
