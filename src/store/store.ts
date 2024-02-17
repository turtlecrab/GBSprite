import { StateCreator, StoreApi, create } from 'zustand'
import { persist } from 'zustand/middleware'

import { getLine, getPixelCoords } from '../lib/utils'
import { bucket } from './tools/bucket'
import { ellipse } from './tools/ellipse'
import { pencil } from './tools/pencil'
import { rect } from './tools/rect'

const DEFAULT_TILE_SIZE = 8
const DEFAULT_WIDTH = 1
const DEFAULT_HEIGHT = 1
const DEFAULT_PIXELS_SIZE =
  DEFAULT_TILE_SIZE * DEFAULT_TILE_SIZE * DEFAULT_WIDTH * DEFAULT_HEIGHT

export type Tool = 'pencil' | 'bucket' | 'rect' | 'ellipse'

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

export type Setter = StoreApi<State>['setState']
export type Getter = StoreApi<State>['getState']

export interface State {
  palette: string[]
  tileSize: number
  width: number // of tiles
  height: number // of tiles
  pixels: number[]
  color: number
  tool: Tool
  dragging: boolean
  draggingFrom: number | null
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

  setPalette: (palette: string[]) => void
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
  undo: () => void
  redo: () => void
  zoomIn: () => void
  zoomOut: () => void
  setSize: (w: number, h: number) => void
  setPreviewZoom: (zoom: number) => void
  setGridVisible: (gridVisible: boolean) => void
  toggleGridVisible: () => void
}

const initializer: StateCreator<State> = (set, get) => ({
  palette: ['#e0f8d0', '#88c070', '#346856', '#081820'],
  tileSize: DEFAULT_TILE_SIZE,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  pixels: Array(DEFAULT_PIXELS_SIZE).fill(0),
  color: 3,
  tool: 'pencil',
  dragging: false,
  draggingFrom: null,
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

  setPalette: palette => {
    if (!palette.every(color => /^#[\da-fA-F]{6}$/.test(color))) {
      console.error('error parsing palette')
      return
    }
    set({ palette })
  },
  setColor: color => set({ color }),
  setPixel: index =>
    set(state => ({
      pixels: state.pixels.map((p, i) => (i === index ? state.color : p)),
    })),
  setDragging: dragging => set({ dragging }),
  setTool: tool => {
    if (get().dragging) return
    set({ tool })
  },
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
              get().width * get().tileSize,
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
        pencil.startDragging(index, set, get)
        break
      case 'bucket':
        bucket.startDragging(index, set, get)
        break
      case 'rect':
        rect.startDragging(index, set, get)
        break
      case 'ellipse':
        ellipse.startDragging(index, set, get)
        break
    }
  },
  hoverPixel: index => {
    if (index === get().lastHoveredPixel) return

    switch (get().tool) {
      case 'pencil':
        pencil.hoverPixel(index, set, get)
        break
      case 'rect':
        rect.hoverPixel(index, set, get)
        break
      case 'ellipse':
        ellipse.hoverPixel(index, set, get)
        break
    }
    set({ lastHoveredPixel: index })
  },
  stopDragging: () => {
    if (!get().dragging) return
    get().setDragging(false)

    get().commitDraft()
    set({ draggingFrom: null })
  },
  commitDraft: () => {
    if (get().draft.length === 0) return

    get().pushStateToHistory()
    const draftSet = new Set(get().draft.flat())
    const color = get().color
    set({
      draft: [],
      pixels: get().pixels.map((pixel, i) => (draftSet.has(i) ? color : pixel)),
      lastDrawnPixel: get().draft.at(-1)?.at(-1) ?? null,
    })
  },
  pushStateToHistory: () =>
    set(state => ({
      history: [...state.history, getStateSnapshot(state)],
      redoHistory: [],
    })),
  clearLastHoveredPixel: () => set({ lastHoveredPixel: null }),
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

    const nextZoom = [...get().zoomLevels].reverse().find(v => v < get().zoom)
    set({ zoom: nextZoom })
  },
  setPreviewZoom: zoom => set({ previewZoom: zoom }),
  setSize: (newWidth, newHeight) => {
    // TODO: add pivot points
    const state = get()
    if (newWidth === state.width && newHeight === state.height) return

    const newPixels: number[] = []

    const oldPixelWidth = state.width * state.tileSize
    const newPixelWidth = newWidth * state.tileSize
    const minPixelHeight = Math.min(state.height, newHeight) * state.tileSize

    if (newWidth < state.width) {
      // crop right
      for (let i = 0; i < minPixelHeight; i++) {
        const offset = oldPixelWidth * i

        newPixels.push(...state.pixels.slice(offset, offset + newPixelWidth))
      }
    } else {
      // add pixels on the right
      for (let i = 0; i < minPixelHeight; i++) {
        const offset = oldPixelWidth * i

        newPixels.push(
          ...state.pixels.slice(offset, offset + oldPixelWidth),
          ...Array(newPixelWidth - oldPixelWidth).fill(0),
        )
      }
    }
    if (newHeight > state.height) {
      // add pixels at the bottom
      const remainingPixelHeight = (newHeight - state.height) * state.tileSize

      newPixels.push(...Array(remainingPixelHeight * newPixelWidth).fill(0))
    }

    // offset last drawn pixel position
    let newLastDrawnPixel = null

    if (state.lastDrawnPixel !== null) {
      const { x, y } = getPixelCoords(state.lastDrawnPixel, oldPixelWidth)
      // keep last drawn pixel only when it's not cropped from the right
      // because in this case we can't represent its position by index
      if (x < newPixelWidth) {
        newLastDrawnPixel = y * newPixelWidth + x
      }
    }

    const resizedState: StateSnapshot = {
      pixels: newPixels,
      width: newWidth,
      height: newHeight,
      lastDrawnPixel: newLastDrawnPixel,
    }
    state.pushStateToHistory()
    set(resizedState)
  },
  setGridVisible: gridVisible => set({ gridVisible }),
  toggleGridVisible: () => set({ gridVisible: !get().gridVisible }),
})

export const useStore = create<State>()(
  persist(initializer, {
    name: 'GBSprite',
    partialize: state => ({
      tileSize: state.tileSize,
      width: state.width,
      height: state.height,
      pixels: state.pixels,
      color: state.color,
      zoom: state.zoom,
    }),
  }),
)
