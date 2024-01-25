import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  palette: string[]
  color: number
  width: number // of sprites
  height: number // of sprites
  pixels: number[]

  setColor: (color: number) => void
  setPixel: (index: number) => void
  clearPixels: () => void
}

export const useStore = create<State>()(
  persist(
    set => ({
      palette: ['#fff', '#aaa', '#888', '#000'],
      color: 0,
      width: 1,
      height: 1,
      pixels: Array(64).fill(0),

      setColor: color => set({ color }),
      setPixel: index =>
        set(state => ({
          pixels: state.pixels.map((p, i) => (i === index ? state.color : p)),
        })),
      clearPixels: () => set(state => ({ pixels: state.pixels.map(_ => 0) })),
    }),
    { name: 'GBSprite' }
  )
)
