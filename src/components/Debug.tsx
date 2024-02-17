import { styled } from '@linaria/react'

import { getPixelCoords } from '../lib/utils'
import { useStore } from '../store/store'

export function Debug() {
  const dragging = useStore(state => state.dragging)
  const lastHoveredPixel = useStore(state => state.lastHoveredPixel)
  const lastDrawnPixel = useStore(state => state.lastDrawnPixel)
  const pixelWidth = useStore(state => state.width * state.tileSize)
  const altPressed = useStore(state => state.altPressed)
  const shiftPressed = useStore(state => state.shiftPressed)
  const ctrlPressed = useStore(state => state.ctrlPressed)

  return (
    <List>
      <li>dragging: {String(dragging)}</li>
      <li>
        alt/shift/ctrl: {altPressed && 'alt'} {shiftPressed && 'shift'}{' '}
        {ctrlPressed && 'ctrl'}
      </li>
      <li>
        lastHoveredPixel: {String(lastHoveredPixel)}{' '}
        {lastHoveredPixel !== null &&
          JSON.stringify(
            Object.values(getPixelCoords(lastHoveredPixel, pixelWidth)),
          )}
      </li>
      <li>
        lastDrawnPixel: {String(lastDrawnPixel)}{' '}
        {lastDrawnPixel !== null &&
          JSON.stringify(
            Object.values(getPixelCoords(lastDrawnPixel, pixelWidth)),
          )}
      </li>
    </List>
  )
}

const List = styled.div`
  list-style: none;
  margin-top: 32px;
`
