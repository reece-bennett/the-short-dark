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
    for (let colIndex = 0; colIndex < thisInventory.columns; colIndex++) {
      for (let rowIndex = 0; rowIndex < thisInventory.rows; rowIndex++) {
        const cell = document.createElement('button')
        cell.classList.add('inventory-cell')
        gridElement.append(cell)

        // If there's an item in this cell, put it in
        thisInventory.items.forEach(item => {
          if (item.column === colIndex && item.row === rowIndex) {
            cell.handleLeftMouseUp = () => {
              thisInventory.remove(item)
              otherInventory.add(item)
              this.updateInventoryUi()
            }

            cell.handleRightMouseUp = () => {
              item.user = this.gameObject
              item.use()
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
                <h2>${item.name}</h2>
                <p>${item.description}</p>
              `
            })

            const actionElement = document.createElement('div')
            actionElement.innerText = item.action
            actionElement.classList = 'action'
            cell.append(actionElement)
            cell.append(item.createUiElement())

            // TODO: Increment indexes if it's a big item?
            // So we don't end up with too many cells?
          } else {
            cell.disabled = true
          }
        })
      }
    }
  }

  updateInventoryUi() {
    const playerInventoryGrid = $('.inventory .player .grid')
    playerInventoryGrid.innerHTML = ''

    this.generateCells(playerInventoryGrid, this, this.lookingIn)

    // for (let colIndex = 0; colIndex < this.columns; colIndex++) {
    //   for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
    //     const cell = document.createElement('div')
    //     cell.classList.add('inventory-cell')
    //     playerInventoryGrid.append(cell)
    //
    //     // If there's an item in this cell, put it in
    //     this.items.forEach(item => {
    //       if (item.column === colIndex && item.row === rowIndex) {
    //         cell.addEventListener('click', () => {
    //           // Use item?
    //           // Equip item?
    //         })
    //         const itemElement = document.createElement('div')
    //         itemElement.className = `item ${item.className}`
    //         cell.append(itemElement)
    //         // TODO: Increment indexes if it's a big item?
    //         // So we don't end up with too many cells?
    //       }
    //     })
    //   }
    // }

    // const playerTab = $('.tab-player')
    // playerTab.innerHTML = ''
    // this.items.forEach(item => {
    //   const row = document.createElement('div')
    //   row.classList.add('row')
    //   if (this.equipped === item) {
    //     row.classList.add('highlight')
    //   }
    //   row.innerText = item.name
    //   row.addEventListener('click', () => {
    //     if (this.lookingIn) {
    //       // TODO: Equip system
    //       // if (this.equipped === item) {
    //       //   this.unequip()
    //       // }
    //       this.remove(item)
    //       this.lookingIn.add(item)
    //       this.updateInventoryUi()
    //     }
    //   })
    //   const button = document.createElement('button')
    //   button.classList.add('button')
    //   button.innerText = item.useName
    //   if (this.equipped === item) {
    //     button.innerText = 'Unequip'
    //   }
    //   button.addEventListener('click', event => {
    //     event.stopPropagation()
    //     if (item.use(this)) {
    //       this.remove(item)
    //       // TODO: Consuming items
    //       // this.lastEaten = this.game.timestamp
    //     }
    //     this.updateInventoryUi()
    //   })
    //   row.append(button)
    //   playerTab.append(row)
    // })

    if (this.lookingIn) {
      const containerInventoryName = $('.inventory .container .name')
      containerInventoryName.innerHTML = this.lookingIn.name
      const containerInventoryGrid = $('.inventory .container .grid')
      containerInventoryGrid.innerHTML = ''

      this.generateCells(containerInventoryGrid, this.lookingIn, this)
    }

    $('.inventory .section.container').setAttribute('aria-hidden', !this.lookingIn)
    $('.inventory').setAttribute('aria-hidden', !this.isOpen)
  }
}
