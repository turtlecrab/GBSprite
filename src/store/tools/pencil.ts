import { arePixelsAtRightAngle, getLine } from '../../lib/utils'
import { Getter, Setter } from '../store'

export const pencil = {
  startDragging(index: number, set: Setter, get: Getter) {
    get().setDragging(true)
    set({ draft: [...get().draft, [index, index]] })
  },

  hoverPixel(index: number, set: Setter, get: Getter) {
    if (index === get().lastHoveredPixel) return
    if (!get().dragging && !get().shiftPressed) return

    if (!get().dragging && get().shiftPressed) {
      if (get().lastDrawnPixel === null) return

      // not dragging, shift pressed & has last drawn pixel -> line preview
      const width = get().width * get().tileSize
      set({ draft: [getLine(get().lastDrawnPixel, index, width)] })
      return
    }

    // pixel-perfect pencil
    const width = get().width * get().tileSize
    const newLine = getLine(get().lastHoveredPixel, index, width)
    const prevLine = get().draft.at(-1)!

    if (prevLine.length < 2) throw new Error('bad segment')

    // check for └ ┘ ┌ ┐
    if (
      prevLine.at(-1)! === newLine[0] &&
      arePixelsAtRightAngle(prevLine.at(-2)!, newLine[0], newLine[1], width)
    ) {
      // shorten newLine,
      newLine.shift()

      // shorten prevLine
      prevLine.pop() // mutating state kinda bad, TODO

      // ensure newLine.length >= 2)
      if (newLine.length === 1) {
        newLine.push(newLine[0])
      }
    }
    set({
      draft: [...get().draft, newLine],
    })
  },
}
