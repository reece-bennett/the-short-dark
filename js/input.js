export default {
  keysDown: new Set(),
  keysPressed: new Set(),
  createListeners() {
    document.addEventListener('keydown', event => {
      this.keysDown.add(event.code),
      this.keysPressed.add(event.code)
      // TODO: Send event
    })
    document.addEventListener('keyup', event => {
      this.keysDown.delete(event.code)
      // TODO: Send event
    })
  },
  update() {
    this.keysPressed.clear()
  },
  isKeyDown(key) {
    return this.keysDown.has(key)
  }
}
