import { Getter, Setter } from '../store'

export const hand = {
  startDragging(_index: number, set: Setter, _get: Getter) {
    set({
      dragging: true,
    })
  },
  hoverPixel(dx: number, dy: number, _set: Setter, get: Getter) {
    if (!get().dragging) return

    get().moveCanvasPos({ x: -dx, y: -dy })
  },
}
