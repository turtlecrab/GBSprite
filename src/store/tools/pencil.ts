import { arePixelsAtRightAngle, getLine } from '../../lib/utils'
import { Getter, MouseButton, Setter } from '../store'

export const pencil = (set: Setter, get: Getter) => ({
  startDragging(index: number, button: MouseButton) {
    set({
      dragging: button,
      draft: [...get().draft, [index, index]],
    })
  },

  movePointer(index: number) {
    if (index === get().lastHoveredPixel) return
    if (!get().dragging && !get().shiftPressed) return

    const pixelWidth = get().width * get().tileSize

    if (!get().dragging && get().shiftPressed) {
      if (get().lastDrawnPixel === null) return

      // not dragging, shift pressed & has last drawn pixel -> line preview
      set({ draft: [getLine(get().lastDrawnPixel, index, pixelWidth)] })
      return
    }

    const newLine = getLine(get().lastHoveredPixel, index, pixelWidth)

    if (!get().toolSettings.pixelPerfectPencil) {
      set({ draft: [...get().draft, newLine] })
      return
    }

    const prevLine = get().draft.at(-1)!

    if (prevLine.length < 2) throw new Error('bad segment')

    // check for └ ┘ ┌ ┐
    if (
      prevLine.at(-1)! === newLine[0] &&
      arePixelsAtRightAngle(
        prevLine.at(-2)!,
        newLine[0],
        newLine[1],
        pixelWidth,
      )
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
})
