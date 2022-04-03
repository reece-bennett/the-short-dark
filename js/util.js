export const $ = selectors => document.querySelector(selectors)

export function createDiv(parent, ...classNames) {
  const element = document.createElement('div')
  element.classList.add(...classNames)
  parent.append(element)
  return element
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
