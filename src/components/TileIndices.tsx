import { styled } from '@linaria/react'
import { memo } from 'react'

import { getPixelCoords } from '../lib/utils'
import { useStore } from '../store/store'

export const TileIndices = memo(() => {
  const width = useStore(state => state.width)
  const height = useStore(state => state.height)
  const mode = useStore(state => state.exportSettings.mode)

  const adjustedMode = height % 2 === 0 ? mode : '8x8'

  return (
    <Container $width={width} $height={height}>
      {Array(width * height)
        .fill(null)
        .map((_, i) => (
          <span key={i}>{getTileNum(i, width, adjustedMode)}</span>
        ))}
    </Container>
  )
})

function getTileNum(index: number, width: number, mode: '8x8' | '8x16') {
  if (mode === '8x8') return index

  const { x, y } = getPixelCoords(index, width)

  return x * 2 + (y & 1) + ((y >> 1) << 1) * width
}
const Container = styled.div<{ $width: number; $height: number }>`
  position: absolute;
  display: grid;
  pointer-events: none;
  grid-template-columns: repeat(${p => p.$width}, minmax(0, 1fr));
  grid-template-rows: repeat(${p => p.$height}, minmax(0, 1fr));
  width: 100%;
  height: 100%;

  span {
    margin: 4px;
    padding: 0px 8px;
    color: var(--gray-1);
    background-color: var(--gray-9);
    width: min-content;
    height: min-content;
    border-radius: 4px;
    font-family: monospace;
    font-size: 16px;
  }
`
