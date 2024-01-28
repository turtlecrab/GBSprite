import { useEffect } from 'react'

import { useStore } from '../store'

const cursors = {
  pencil: 'crosshair',
  bucket: 'crosshair',
  eyeDropper: 'alias',
}

/**
 * contains extracted effects to minimize rerenders
 * of a parent component (TODO?)
 */
export function CanvasSideEffects() {
  const tool = useStore(state => state.tool)
  const tempEyeDropper = useStore(state => state.tempEyeDropper)
  const color = useStore(state => state.color)
  const palette = useStore(state => state.palette)

  // cell cursor style
  useEffect(() => {
    document.body.style.setProperty(
      '--cell-cursor',
      tempEyeDropper ? cursors['eyeDropper'] : cursors[tool],
    )
    return () => {
      document.body.style.removeProperty('--cell-cursor')
    }
  }, [tempEyeDropper, tool])

  // cell hover style
  useEffect(() => {
    document.body.style.setProperty(
      '--cell-hover-color',
      tempEyeDropper ? '' : palette[color],
    )
    return () => {
      document.body.style.removeProperty('--cell-hover-color')
    }
  }, [tempEyeDropper, tool, color, palette])

  return null
}
