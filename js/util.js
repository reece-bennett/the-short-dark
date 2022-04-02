export const $ = selectors => document.querySelector(selectors)

export function createDiv(parent, ...classNames) {
  const element = document.createElement('div')
  element.classList.add(...classNames)
  parent.append(element)
  return element
}
