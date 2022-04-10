export default class Vec2 {
  constructor(x, y) {
    this.x = x ?? 0
    this.y = y ?? 0
  }

  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y)
  }

  subtract(other) {
    return new Vec2(this.x - other.x, this.y - other.y)
  }

  multiply(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalise() {
    const length = this.length()
    if (length > 0) {
      return new Vec2(this.x / length, this.y / length)
    } else {
      return this
    }
  }

  rotateTo(angle) {
    const length = this.length()
    return new Vec2(length * Math.sin(angle), length * Math.cos(angle))
  }

  angleTo(other) {
    const diff = this.subtract(other)
    return Math.atan2(diff.y, diff.x) - Math.PI / 2
  }

  set(x, y) {
    this.x = x
    this.y = y
  }
}
