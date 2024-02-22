import { Getter, MouseButton, Setter } from '../store'

export const hand = {
  startDragging(
    _index: number,
    button: MouseButton,
    set: Setter,
    _get: Getter,
  ) {
    set({
      dragging: button,
    })
  },
  hoverPixel(dx: number, dy: number, _set: Setter, get: Getter) {
    if (!get().dragging) return

    get().moveCanvasPos({ x: -dx, y: -dy })
  },
}
