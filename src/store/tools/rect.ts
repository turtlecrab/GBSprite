import { getLineByCoords, getPixelCoords } from '../../lib/utils'
import { Getter, MouseButton, Setter } from '../store'

export const rect = {
  startDragging(index: number, button: MouseButton, set: Setter, _get: Getter) {
    set({
      dragging: button,
      draggingFrom: index,
      draft: [[index]],
    })
  },
  hoverPixel(index: number, set: Setter, get: Getter) {
    if (index === get().lastHoveredPixel) return
    if (!get().dragging || get().draggingFrom === null) return

    const width = get().width * get().tileSize

    const { x: x0, y: y0 } = getPixelCoords(get().draggingFrom!, width)
    const { x: x1, y: y1 } = getPixelCoords(index, width)

    set({
      draft: [
        getLineByCoords(x0, y0, x0, y1, width),
        getLineByCoords(x0, y0, x1, y0, width),
        getLineByCoords(x0, y1, x1, y1, width),
        getLineByCoords(x1, y0, x1, y1, width),
      ],
    })
  },
  stopDragging(set: Setter, get: Getter) {
    if (!get().toolSettings.filledRect) {
      get().commitDraft()
      return
    }
    const first = get().draft[0][0]
    const last = get().draft.at(-1)!.at(-1)!

    const pixelWidth = get().width * get().tileSize

    const { x: x0, y: y0 } = getPixelCoords(first, pixelWidth)
    const { x: x1, y: y1 } = getPixelCoords(last, pixelWidth)

    const filledDraft = []

    // preserving lastDrawnPixel, TODO?
    for (let y = y0; y0 > y1 ? y >= y1 : y <= y1; y0 > y1 ? y-- : y++) {
      filledDraft.push(getLineByCoords(x0, y, x1, y, pixelWidth))
    }
    set({ draft: filledDraft })
    get().commitDraft()
  },
}
