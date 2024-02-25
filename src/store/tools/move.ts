import { getPixelCoords } from '../../lib/utils'
import { Getter, MouseButton, Setter } from '../store'

export const move = {
  startDragging(index: number, button: MouseButton, set: Setter, _get: Getter) {
    set({
      dragging: button,
      draggingFrom: index,
    })
  },
  hoverPixel(index: number, set: Setter, get: Getter) {
    if (index === get().lastHoveredPixel) return
    if (!get().dragging || get().draggingFrom === null) return

    const width = get().width * get().tileSize

    set({ moveOffset: getOffset(get().draggingFrom!, index, width) })
  },
  stopDragging(set: Setter, get: Getter) {
    if (!get().moveOffset) return

    const width = get().width * get().tileSize

    get().pushStateToHistory()
    set({
      pixels: getOffsetImage(get().pixels, width, get().moveOffset!),
      moveOffset: null,
    })
  },
}

function getOffsetImage(
  image: number[],
  width: number,
  offset: { x: number; y: number },
): number[] {
  const offsetImage: number[] = []

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const prevX = (x - offset.x + width) % width
      const prevY = (y - offset.y + width) % width
      const prevIndex = prevX + prevY * width

      offsetImage.push(image[prevIndex])
    }
  }
  return offsetImage
}

function getOffset(fromIndex: number, toIndex: number, width: number) {
  const { x: x1, y: y1 } = getPixelCoords(fromIndex, width)
  const { x: x2, y: y2 } = getPixelCoords(toIndex, width)
  return {
    x: x2 - x1,
    y: y2 - y1,
  }
}
