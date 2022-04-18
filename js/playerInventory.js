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
      this.open(event.detail.container)
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

  updateInventoryUi() {
    const playerInventoryGrid = $('.inventory .player .grid')
    playerInventoryGrid.innerHTML = ''

    for (let colIndex = 0; colIndex < this.columns; colIndex++) {
      for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        playerInventoryGrid.append(cell)

        // If there's an item in this cell, put it in
        this.items.forEach(item => {
          if (item.column === colIndex && item.row === rowIndex) {
            cell.addEventListener('click', () => {
              // Use item?
              // Equip item?
            })
            const itemElement = document.createElement('div')
            itemElement.className = `item ${item.className}`
            cell.append(itemElement)
            // TODO: Increment indexes if it's a big item?
            // So we don't end up with too many cells?
          }
        })
      }
    }

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

      for (let colIndex = 0; colIndex < this.lookingIn.columns; colIndex++) {
        for (let rowIndex = 0; rowIndex < this.lookingIn.rows; rowIndex++) {
          const cell = document.createElement('div')
          cell.classList.add('cell')
          containerInventoryGrid.append(cell)

          // If there's an item in this cell, put it in
          this.lookingIn.items.forEach(item => {
            if (item.column === colIndex && item.row === rowIndex) {
              cell.addEventListener('click', () => {
                item.user = this.gameObject
                item.use()
                this.updateInventoryUi()
                // Equip item?
              })
              const actionElement = document.createElement('div')
              actionElement.innerText = item.action
              actionElement.classList = 'action'
              cell.append(actionElement)
              cell.append(item.createUiElement())

              // Temp info stuff for last item
              $('.inventory .info .box').innerHTML = `
                <p>
                  ${item.description}
                </p>
              `

              // TODO: Increment indexes if it's a big item?
              // So we don't end up with too many cells?
            }
          })
        }
      }

      // const containerTab = $('.tab-container')
      // containerTab.innerHTML = ''
      // this.lookingIn.items.forEach(item => {
      //   const row = document.createElement('div')
      //   row.classList.add('row')
      //   row.innerText = item.name
      //   row.addEventListener('click', event => {
      //     event.stopPropagation()
      //     this.lookingIn.remove(item)
      //     this.add(item)
      //     this.updateInventoryUi()
      //   })
      //   containerTab.append(row)
      // })
    }

    $('.inventory .section.container').setAttribute('aria-hidden', !this.lookingIn)
    $('.inventory').setAttribute('aria-hidden', !this.isOpen)
  }
}
