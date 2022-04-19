import Inventory from './inventory.js'
import { $ } from './util.js'

export default class PlayerInventory extends Inventory {
  constructor(params) {
    super({columns: 4, ...params})
    this.isOpen = false
    this.lookingIn = null
  }

  create() {
    document.addEventListener('keydown', event => {
      switch (event.code) {
        case 'Tab':
          if (this.isOpen) {
            this.close()
          } else {
            this.open()
          }
          event.preventDefault()
          break
      }
    })

    this.gameObject.addEventListener('openContainer', event => {
      if (this.isOpen) {
        this.close()
      } else {
        this.open(event.detail.container)
      }
    })
  }

  open(container) {
    this.isOpen = true
    if (container) this.lookingIn = container
    this.updateInventoryUi()
  }

  close() {
    this.isOpen = false
    if (this.lookingIn) {
      this.lookingIn = null
    }
    this.updateInventoryUi()
  }

  generateCells(gridElement, thisInventory, otherInventory) {
    for (let rowIndex = 0; rowIndex < thisInventory.rows; rowIndex++) {
      for (let colIndex = 0; colIndex < thisInventory.columns; colIndex++) {
        const cell = document.createElement('button')
        cell.classList.add('inventory-cell')
        gridElement.append(cell)

        const itemInThisCell = thisInventory.items.find((item) =>
          item.column === colIndex && item.row === rowIndex
        )

        if (itemInThisCell) {
          cell.handleLeftMouseUp = () => {
            cell.classList.remove('active-left')

            if (otherInventory) {
              thisInventory.remove(itemInThisCell)
              otherInventory.add(itemInThisCell)
              this.updateInventoryUi()
            }
          }

          cell.handleRightMouseUp = () => {
            cell.classList.remove('active-right')
            itemInThisCell.user = this.gameObject
            itemInThisCell.use()
            this.updateInventoryUi()
          }

          cell.addEventListener('contextmenu', event => event.preventDefault())

          cell.addEventListener('mousedown', event => {
            switch (event.button) {
              case 0:
                cell.removeEventListener('mouseup', cell.handleRightMouseUp)
                cell.addEventListener('mouseup', cell.handleLeftMouseUp)
                cell.classList.add('active-left')
                cell.handleMouseMove = cell.addEventListener('mousemove', () => {
                  // TODO: Do click and drag stuff
                })
                break
              case 2:
                cell.removeEventListener('mouseup', cell.handleLeftMouseUp)
                cell.classList.add('active-right')
                // We're about to use the item?
                cell.addEventListener('mouseup', cell.handleRightMouseUp)
                break
            }
          })

          cell.addEventListener('mouseleave', () => {
            cell.classList.remove('active-left')
            cell.classList.remove('active-right')
          })

          cell.addEventListener('mouseenter', () => {
            $('.inventory .info .box').innerHTML = `
              <h2>${itemInThisCell.name}</h2>
              <p>${itemInThisCell.description}</p>
            `
          })

          const actionElement = document.createElement('div')
          actionElement.innerText = itemInThisCell.action
          actionElement.classList = 'action'
          cell.append(actionElement)
          cell.append(itemInThisCell.createUiElement())

          // TODO: Increment indexes if it's a big item?
          // So we don't end up with too many cells?
        } else {
          // Cells with nothing in are disabled
          cell.disabled = true
        }
      }
    }
  }

  updateInventoryUi() {
    const playerInventoryGrid = $('.inventory .player .grid')
    playerInventoryGrid.innerHTML = ''
    $('.inventory .info .box').innerHTML = ''

    this.generateCells(playerInventoryGrid, this, this.lookingIn)

    const lookingInElement = $('.inventory .container')

    if (this.lookingIn) {
      lookingInElement.style.display = ''
      const containerInventoryName = $('.inventory .container .name')
      containerInventoryName.innerHTML = this.lookingIn.name
      const containerInventoryGrid = $('.inventory .container .grid')
      containerInventoryGrid.innerHTML = ''

      this.generateCells(containerInventoryGrid, this.lookingIn, this)
    } else {
      lookingInElement.style.display = 'none'
    }

    $('.inventory .section.container').setAttribute('aria-hidden', !this.lookingIn)
    $('.inventory').setAttribute('aria-hidden', !this.isOpen)
  }
}
