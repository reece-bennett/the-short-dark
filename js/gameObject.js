import Vec2 from './vec2.js'

export default class GameObject extends EventTarget {
  constructor({ name, components, position, rotation }) {
    super()
    this.name = name ?? 'Unnamed gameObject'
    this.components = []
    this.parent = null
    this.children = []
    this.position = position ?? new Vec2()
    this.rotation = rotation ?? 0

    for (const component of components ?? []) {
      this.addComponent(component)
    }
  }

  addComponent(component) {
    component.gameObject = this
    this.components.push(component)
    return component
  }

  addChild(child) {
    child.parent = this
    this.children.push(child)
    return child
  }

  getGameObject(path) {
    const segments = (path.startsWith('/') ? path.substring(1) : path).split('/')
    let next = segments.shift()
    let current = path.startsWith('/') ? this.getRootGameObject() : this
    while (next) {
      if (next === '..') {
        current = current.parent
        next = segments.shift()
      } else {
        let found = false
        for (const child of current.children) {
          if (child.name === next) {
            current = child
            next = segments.shift()
            found = true
            break
          }
        }
        if (!found) {
          console.error(`Cannot find ${path} from ${this.name}`)
          return null
        }
      }
    }
    return current
  }

  getRootGameObject() {
    let current = this
    while (current.parent) {
      current = current.parent
    }
    return current
  }

  getComponent(name) {
    return this.components.find(component => component.name === name)
  }

  /*
    Lifecycle methods
  */

  create() {
    for (const child of this.children) {
      child.create()
    }
    for (const component of this.components) {
      component.create()
    }
  }

  update(dt) {
    for (const child of this.children) {
      child.update(dt)
    }
    for (const component of this.components) {
      component.update(dt)
    }
  }

  lateUpdate(dt) {
    for (const child of this.children) {
      child.lateUpdate(dt)
    }
    for (const component of this.components) {
      component.lateUpdate(dt)
    }
  }

  draw() {
    for (const child of this.children) {
      child.draw()
    }
    for (const component of this.components) {
      component.draw()
    }
  }

  destroy() {
    for (const child of this.children) {
      child.destroy()
    }
    for (const component of this.components) {
      component.destroy()
    }
  }
}
