import { useEffect } from 'react'

import { useStore } from '../store/store'

const cursors = {
  eyeDropper: 'alias',
  pencil: 'crosshair',
  bucket: 'crosshair',
  rect: 'crosshair',
  ellipse: 'crosshair',
  hand: 'grab',
}

/**
 * contains extracted effects to minimize rerenders
 * of a parent component (TODO?)
 */
export function CanvasSideEffects() {
  const tool = useStore(state => state.tool)
  const altPressed = useStore(state => state.altPressed)
  const zoom = useStore(state => state.zoom)
  const isHandDrag = useStore(
    state =>
      state.dragging === 'middle' || (state.tool === 'hand' && state.dragging),
  )

  // canvas cursor style
  useEffect(() => {
    document.body.style.setProperty(
      '--canvas-cursor',
      altPressed
        ? cursors['eyeDropper']
        : isHandDrag
          ? 'grabbing'
          : cursors[tool],
    )
    return () => {
      document.body.style.removeProperty('--canvas-cursor')
    }
  }, [altPressed, isHandDrag, tool])

  // pixel scale
  useEffect(() => {
    document.body.style.setProperty('--pixel-size', zoom + 'px')
    return () => {
      document.body.style.removeProperty('--pixel-size')
    }
  }, [zoom])

  return null
}
