import { getLineByCoords, getPixelCoords } from '../../lib/utils'
import { Getter, Setter } from '../store'

export const rect = {
  startDragging(index: number, set: Setter, _get: Getter) {
    set({
      dragging: true,
      draggingFrom: index,
      draft: [[index]],
    })
  },
  hoverPixel(index: number, set: Setter, get: Getter) {
    if (!get().dragging || !get().draggingFrom) return

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
}
