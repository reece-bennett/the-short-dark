import Object from './object.js'

export default class Rock extends Object {
  constructor({x, y, width, height, rotation}) {
    super({
      name: 'rock',
      x: x,
      y: y,
      width: width ?? 24, // TODO: Random default rock size between sensible min/max
      height: height ?? 24, // TODO: Random default rock size between sensible min/max
      // Rotation messes with shadows so not doing it for now
      // rotation: rotation ?? (Math.random() * 2 * Math.PI) - Math.PI
      spriteXml: '<sprite></sprite>'
    })

    // TODO: Set CSS var or background value to make linear-gradient match "lighting"+rotation
    const surfaceRotation = Math.PI / 4 + (Math.random() * Math.PI / 6) - Math.PI / 12
    this.objectElement.style.setProperty('--surface-rotation', `-${surfaceRotation}rad`)

    if (Math.random() > 0.5) {
      this.objectElement.classList.add('snowy')
    }

    this.collider = {
      type: 'box',
      halfWidth: this.width / 2,
      halfHeight: this.height / 2
    }
  }

  // Text that is fetched if a player inspects the object?
  static inspect = () => `It's just a ${this.name}.`
}
