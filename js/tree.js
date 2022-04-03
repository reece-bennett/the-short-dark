import Object from './object.js'

export default class Tree extends Object {
  constructor({game, x, y, size, snowy}) {
    super({
      game,
      name: 'tree',
      x: x,
      y: y,
      // width: width ?? 24, // TODO: Random default rock size between sensible min/max
      // height: height ?? 24, // TODO: Random default rock size between sensible min/max
      // Rotation messes with shadows so not doing it for now
      // rotation: rotation ?? (Math.random() * 2 * Math.PI) - Math.PI
      spriteXml: '<sprite></sprite>',
    })

    this.size = size ?? Math.floor(Math.random() * 4)

    if (size === 0) {
      const stumpElement = document.createElement('div')
      stumpElement.classList.add('stump')
      this.spriteElement.append(stumpElement)
    } else {
      this.leavesElement = document.createElement('div')
      this.leavesElement.classList.add('leaves')
      this.spriteElement.append(this.leavesElement)

      for (let i = 3; i > 0; i--) {
        const layerSize = (8 + this.size * 3) * i - 2
        const leafLayerElement = document.createElement('div')
        leafLayerElement.classList.add('leaf-layer')
        leafLayerElement.style.width = `${layerSize}px`
        leafLayerElement.style.height = `${layerSize}px`
        leafLayerElement.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`
        this.leavesElement.append(leafLayerElement)
      }
    }

    this.spriteElement.style.setProperty('--polymorph-size', `${2 + this.size * 4}px`)

    // if (Math.random() > 0.5) {
    if (snowy) {
      this.objectElement.classList.add('snowy')
    }

    this.collider = {
      type: 'circle',
      radius: 7
    }
  }

  // Text that is fetched if a player inspects the object?
  static inspect = () => `${this.name}s are good for doing ${this.name} things.`
}
