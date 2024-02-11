import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { arePixelsAtRightAngle, getLine } from './lib/utils'

const DEFAULT_SPRITE_SIZE = 8
const DEFAULT_WIDTH = 1
const DEFAULT_HEIGHT = 1
const DEFAULT_PIXELS_SIZE =
  DEFAULT_SPRITE_SIZE * DEFAULT_SPRITE_SIZE * DEFAULT_WIDTH * DEFAULT_HEIGHT

export type Tool = 'pencil' | 'bucket'

interface StateSnapshot {
  pixels: number[]
  width: number
  height: number
  lastDrawnPixel: number | null
}

const getStateSnapshot = (state: State): StateSnapshot => ({
  pixels: state.pixels,
  width: state.width,
  height: state.height,
  lastDrawnPixel: state.lastDrawnPixel,
})

export interface State {
  palette: string[]
  spriteSize: number
  width: number // of sprites
  height: number // of sprites
  pixels: number[]
  color: number
  tool: Tool
  dragging: boolean
  lastHoveredPixel: number | null
  lastDrawnPixel: number | null
  altPressed: boolean
  shiftPressed: boolean
  ctrlPressed: boolean
  history: StateSnapshot[]
  redoHistory: StateSnapshot[]
  zoom: number
  zoomLevels: number[]
  previewZoom: number
  previewZoomLevels: number[]
  gridVisible: boolean
  draft: number[][]

  setColor: (color: number) => void
  setPixel: (index: number) => void
  setDragging: (drag: boolean) => void
  setTool: (tool: Tool) => void
  setAltPressed: (value: boolean) => void
  setShiftPressed: (value: boolean) => void
  setCtrlPressed: (value: boolean) => void
  startDragging: (index: number) => void
  hoverPixel: (index: number) => void
  stopDragging: () => void
  commitDraft: () => void
  pushStateToHistory: () => void
  clearLastHoveredPixel: () => void
  fillCanvas: (color: number) => void
  fill: (index: number) => void
  undo: () => void
  redo: () => void
  zoomIn: () => void
  zoomOut: () => void
  setSize: (w: number, h: number) => void
  setPreviewZoom: (zoom: number) => void
  setGridVisible: (gridVisible: boolean) => void
  toggleGridVisible: () => void
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
      lastHoveredPixel: null,
      lastDrawnPixel: null,
      altPressed: false,
      shiftPressed: false,
      ctrlPressed: false,
      history: [],
      redoHistory: [],
      zoom: 32,
      zoomLevels: [2, 4, 6, 8, 10, 12, 16, 24, 32, 48, 64, 96, 128],
      previewZoom: 2,
      previewZoomLevels: [2, 4, 8, 16],
      gridVisible: false,
      draft: [],

      setColor: color => set({ color }),
      setPixel: index =>
        set(state => ({
          pixels: state.pixels.map((p, i) => (i === index ? state.color : p)),
        })),
      setDragging: dragging => set({ dragging }),
      setTool: tool => set({ tool }),
      setAltPressed: altPressed => set({ altPressed }),
      setShiftPressed: shiftPressed => {
        // TODO: refactor?
        if (
          get().tool === 'pencil' &&
          !get().dragging &&
          get().lastDrawnPixel !== null
        ) {
          if (shiftPressed && get().lastHoveredPixel !== null) {
            set({
              draft: [
                getLine(
                  get().lastDrawnPixel,
                  get().lastHoveredPixel!,
                  get().width * get().spriteSize,
                ),
              ],
            })
          } else {
            set({ draft: [] })
          }
        }
        set({ shiftPressed })
      },
      setCtrlPressed: ctrlPressed => set({ ctrlPressed }),
      fillCanvas: color => {
        get().pushStateToHistory()
        set(state => ({ pixels: state.pixels.map(_ => color) }))
      },

      startDragging: index => {
        if (get().altPressed) {
          get().setColor(get().pixels[index])
          return
        }

        switch (get().tool) {
          case 'pencil':
            get().setDragging(true)

            set({ draft: [...get().draft, [index, index]] })
            break
          case 'bucket':
            get().pushStateToHistory()
            get().fill(index)
            break
        }
      },
      hoverPixel: index => {
        if (index === get().lastHoveredPixel) return

        // TODO: refactor this mess
        switch (get().tool) {
          case 'pencil': {
            if (!get().dragging && !get().shiftPressed) break

            if (!get().dragging && get().shiftPressed) {
              if (!get().lastDrawnPixel) break

              // not dragging, shift pressed & has last drawn pixel -> line preview
              const width = get().width * get().spriteSize
              set({ draft: [getLine(get().lastDrawnPixel, index, width)] })
              break
            }

            // pixel-perfect pencil
            const width = get().width * get().spriteSize
            const newLine = getLine(get().lastHoveredPixel, index, width)
            const prevLine = get().draft.at(-1)!

            if (prevLine.length < 2) throw new Error('bad segment')

            // check for └ ┘ ┌ ┐
            if (
              prevLine.at(-1)! === newLine[0] &&
              arePixelsAtRightAngle(
                prevLine.at(-2)!,
                newLine[0],
                newLine[1],
                width,
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
            break
          }
        }
        set({ lastHoveredPixel: index })
      },
      stopDragging: () => {
        if (!get().dragging) return
        get().setDragging(false)

        get().commitDraft()
      },
      commitDraft: () => {
        if (get().draft.length === 0) return

        get().pushStateToHistory()
        const draftSet = new Set(get().draft.flat())
        const color = get().color
        set({
          draft: [],
          pixels: get().pixels.map((pixel, i) =>
            draftSet.has(i) ? color : pixel,
          ),
          lastDrawnPixel: get().draft.at(-1)?.at(-1) ?? null,
        })
      },
      pushStateToHistory: () =>
        set(state => ({
          history: [...state.history, getStateSnapshot(state)],
          redoHistory: [],
        })),
      clearLastHoveredPixel: () => set({ lastHoveredPixel: null }),
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

        const prevState = get().history.at(-1)!
        set({
          history: get().history.slice(0, -1),
          redoHistory: [...get().redoHistory, getStateSnapshot(get())],
          ...prevState,
        })
      },
      redo: () => {
        if (get().redoHistory.length === 0) return

        const nextState = get().redoHistory.at(-1)!
        set({
          redoHistory: get().redoHistory.slice(0, -1),
          history: [...get().history, getStateSnapshot(get())],
          ...nextState,
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
      setPreviewZoom: zoom => set({ previewZoom: zoom }),
      setSize: (newWidth, newHeight) => {
        // TODO: refactor(?), add pivot points
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
        } else {
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
        get().pushStateToHistory()
        set({
          // TODO: reset last drawn pixel?
          pixels: newPixels,
          width: newWidth,
          height: newHeight,
        })
      },
      setGridVisible: gridVisible => set({ gridVisible }),
      toggleGridVisible: () => set({ gridVisible: !get().gridVisible }),
    }),
    {
      name: 'GBSprite',
      partialize: state => ({
        spriteSize: state.spriteSize,
        width: state.width,
        height: state.height,
        pixels: state.pixels,
        color: state.color,
        zoom: state.zoom,
      }),
    },
  ),
)
