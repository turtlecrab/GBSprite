import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Tool = 'pencil' | 'bucket'

const DEFAULT_SPRITE_SIZE = 8
const DEFAULT_WIDTH = 1
const DEFAULT_HEIGHT = 1
const DEFAULT_PIXELS_SIZE =
  DEFAULT_SPRITE_SIZE * DEFAULT_SPRITE_SIZE * DEFAULT_WIDTH * DEFAULT_HEIGHT

export interface State {
  palette: string[]
  spriteSize: number
  width: number // of sprites
  height: number // of sprites
  pixels: number[]
  color: number
  tool: Tool
  dragging: boolean
  tempEyeDropper: boolean
  history: number[][]
  redoHistory: number[][]
  zoom: number
  zoomLevels: number[]

  setColor: (color: number) => void
  setPixel: (index: number) => void
  setDragging: (drag: boolean) => void
  setTool: (tool: Tool) => void
  setTempEyeDropper: (value: boolean) => void
  startDragging: (index: number) => void
  stopDragging: () => void
  pushPixelsToHistory: () => void
  hoverCell: (index: number) => void
  clearPixels: () => void
  fill: (index: number) => void
  undo: () => void
  redo: () => void
  zoomIn: () => void
  zoomOut: () => void
  setSize: (w: number, h: number) => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      // palette: ['#fff', '#aaa', '#444', '#000'],
      palette: ['#e0f8d0', '#88c070', '#346856', '#081820'],
      spriteSize: DEFAULT_SPRITE_SIZE,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      pixels: Array(DEFAULT_PIXELS_SIZE).fill(0),
      color: 3,
      tool: 'pencil',
      dragging: false,
      tempEyeDropper: false,
      history: [],
      redoHistory: [],
      zoom: 32,
      zoomLevels: [2, 4, 6, 8, 10, 12, 16, 24, 32, 48, 64, 96, 128],

      setColor: color => set({ color }),
      setPixel: index =>
        set(state => ({
          pixels: state.pixels.map((p, i) => (i === index ? state.color : p)),
        })),
      setDragging: dragging => set({ dragging }),
      setTool: tool => set({ tool }),
      setTempEyeDropper: value => set({ tempEyeDropper: value }),
      clearPixels: () => {
        get().pushPixelsToHistory()
        set(state => ({ pixels: state.pixels.map(_ => 0) }))
      },

      startDragging: index => {
        if (get().tempEyeDropper) {
          get().setColor(get().pixels[index])
          get().setTempEyeDropper(false)
          return
        }
        get().pushPixelsToHistory()

        switch (get().tool) {
          case 'pencil':
            get().setPixel(index)
            get().setDragging(true)
            break
          case 'bucket':
            get().fill(index)
            break
        }
      },
      stopDragging: () => {
        if (!get().dragging) return
        get().setDragging(false)
      },
      pushPixelsToHistory: () => {
        set(state => ({
          history: [...state.history, [...state.pixels]],
          redoHistory: [],
        }))
      },
      hoverCell: index => {
        if (!get().dragging) return
        switch (get().tool) {
          case 'pencil':
            get().setPixel(index)
            break
        }
      },
      fill: index => {
        const pixels = [...get().pixels]
        const width = get().width * DEFAULT_SPRITE_SIZE
        const startColor = pixels[index]
        const replaceColor = get().color

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
      undo: () => {
        if (get().history.length === 0) return

        const prev = get().history.at(-1)
        set({
          history: get().history.slice(0, -1),
          redoHistory: [...get().redoHistory, get().pixels],
          pixels: prev,
        })
      },
      redo: () => {
        if (get().redoHistory.length === 0) return

        const next = get().redoHistory.at(-1)
        set({
          redoHistory: get().redoHistory.slice(0, -1),
          history: [...get().history, get().pixels],
          pixels: next,
        })
      },
      zoomIn: () => {
        if (get().zoom >= get().zoomLevels.at(-1)!) return

        const nextZoom = get().zoomLevels.find(v => v > get().zoom)
        set({ zoom: nextZoom })
      },
      zoomOut: () => {
        if (get().zoom <= get().zoomLevels[0]) return

        const nextZoom = [...get().zoomLevels]
          .reverse()
          .find(v => v < get().zoom)
        set({ zoom: nextZoom })
      },
      setSize: (newWidth, newHeight) => {
        // TODO: refactor
        if (newWidth === get().width && newHeight === get().height) return

        let newPixels: number[] = []
        const minPixelHeight =
          Math.min(get().height, newHeight) * get().spriteSize

        if (newWidth < get().width) {
          // crop right
          for (let i = 0; i < minPixelHeight; i++) {
            newPixels.push(
              ...get().pixels.slice(
                get().width * get().spriteSize * i,
                get().width * get().spriteSize * i +
                  newWidth * get().spriteSize,
              ),
            )
          }
        } else if (newWidth >= get().width) {
          // add pixels on the right
          for (let i = 0; i < minPixelHeight; i++) {
            newPixels.push(
              ...get().pixels.slice(
                get().width * get().spriteSize * i,
                get().width * get().spriteSize * (i + 1),
              ),
              ...Array((newWidth - get().width) * get().spriteSize).fill(0),
            )
          }
        }
        if (newHeight > get().height) {
          // add pixels at the bottom
          newPixels.push(
            ...Array(
              (newHeight - get().height) *
                newWidth *
                get().spriteSize *
                get().spriteSize,
            ).fill(0),
          )
        }
        set({
          pixels: newPixels,
          width: newWidth,
          height: newHeight,
          history: [], // TODO
          redoHistory: [],
        })
      },
    }),
    {
      name: 'GBSprite',
      partialize: state => ({
        spriteSize: state.spriteSize,
        width: state.width,
        height: state.height,
        pixels: state.pixels,
        color: state.color,
      }),
    },
  ),
)
