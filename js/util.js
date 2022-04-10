export const $ = selectors => document.querySelector(selectors)

export function createDiv(...classNames) {
  const element = document.createElement('div')
  element.classList.add(...classNames)
  return element
}

export function createChild(parent, ...classNames) {
  const child = createDiv(classNames)
  return parent.appendChild(child)
}

export function createSpriteElementFromXml(xmlData) {
  // TODO: Share a single DOMParser between all objects? Could be global var?
  const parser = new DOMParser()

  const doc = parser.parseFromString(xmlData, 'text/xml')
  let spriteElement

  const addElements = (fragment, parent) => {
    const newElement = document.createElement('div')
    newElement.classList.add(fragment.tagName); // <- Required semi for array in next line

    [...fragment.children].forEach(child => {
      addElements(child, newElement)
    })

    parent ? parent.append(newElement) : spriteElement = newElement
  }

  addElements(doc.firstChild)

  return spriteElement
}

export function distanceBetween(x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}

export function angleBetween(x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.atan2(dy, dx) - Math.PI / 2
}

export function randomXY(maxDistance) {
  return {
    x: (Math.random() * 2 - 1) * maxDistance,
    y: (Math.random() * 2 - 1) * maxDistance
  }
}

export const lerp = (min, max, percentage) => min + (max - min) * percentage

export const unlerp = (min, max, value) => (value - min) / (max - min)
