import { styled } from '@linaria/react'

import { useStore } from '../store'

export function Debug() {
  const dragging = useStore(state => state.dragging)
  const lastHoveredPixel = useStore(state => state.lastHoveredPixel)
  const pixelWidth = useStore(state => state.width * state.spriteSize)
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
          `(${lastHoveredPixel % pixelWidth}, ` +
            `${(lastHoveredPixel - (lastHoveredPixel % pixelWidth)) / pixelWidth})`}
      </li>
    </List>
  )
}

const List = styled.div`
  list-style: none;
  margin-top: 32px;
`
