import { styled } from '@linaria/react'

import { useStore } from '../store'

export function Debug() {
  const dragging = useStore(state => state.dragging)
  const lastHoveredPixel = useStore(state => state.lastHoveredPixel)
  const pixelWidth = useStore(state => state.width * state.spriteSize)

  return (
    <List>
      <li>dragging : {String(dragging)}</li>
      <li>
        lastHoveredPixel : {String(lastHoveredPixel)}{' '}
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
