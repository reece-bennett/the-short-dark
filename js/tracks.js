import Object from './object.js'
import { createDiv } from './util.js'

export class Tracks extends Object {
  constructor({game}) {
    super({
      game,
      name: 'tracks'
    })
    this.tracks = []
  }

  add(x, y, size) {
    // console.log('Adding track', x, y)
    const track = createDiv(this.spriteElement)
    track.style.width = `${size}px`
    track.style.height = `${size}px`
    track.style.transform = `translate(${x}px, ${y}px)`
    this.tracks.push(track)

    if (this.tracks.length > 100) {
      const track = this.tracks.shift()
      track.remove()
    }
  }
}
