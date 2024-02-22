import { Getter, MouseButton, Setter } from '../store'

export const bucket = {
  startDragging(index: number, _button: MouseButton, set: Setter, get: Getter) {
    get().pushStateToHistory()

    if (get().toolSettings.continuousBucket) {
      this.floodFill(index, set, get)
    } else {
      this.replaceColor(index, set, get)
    }
  },
  replaceColor: (index: number, set: Setter, get: Getter) => {
    const startColor = get().pixels[index]
    const replaceColor = get().color

    if (startColor === replaceColor) return

    set({
      pixels: get().pixels.map(p => (p === startColor ? replaceColor : p)),
    })
  },
  floodFill: (index: number, set: Setter, get: Getter) => {
    const pixels = [...get().pixels]
    const width = get().width * get().tileSize
    const startColor = pixels[index]
    const replaceColor = get().color

    if (startColor === replaceColor) return

    const visited = new Set<number>()

    const stack = [index]

    while (stack.length) {
      const next = stack.pop()!

      // boundary check
      if (next < 0 || next >= pixels.length) continue

      // already filled check
      if (visited.has(next)) continue

      // wall check
      if (pixels[next] !== startColor) continue

      // fill
      pixels[next] = replaceColor
      visited.add(next)

      // expand
      stack.push(next - width) // up
      stack.push(next + width) // down
      if (next % width > 0) stack.push(next - 1) // left
      if (next % width < width - 1) stack.push(next + 1) // right
    }
    set({ pixels })
  },
}
