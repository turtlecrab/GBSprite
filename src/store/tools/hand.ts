import { Getter, MouseButton, Setter } from '../store'

export const hand = (set: Setter, get: Getter) => ({
  startDragging(_index: number, button: MouseButton) {
    set({
      dragging: button,
    })
  },

  movePointer(_index: number, dx: number, dy: number) {
    if (!get().dragging) return

    get().moveCanvasPos({ x: -dx, y: -dy })
  },
})
