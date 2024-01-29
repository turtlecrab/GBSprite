import { styled } from '@linaria/react'
import { useEffect } from 'react'

import { useStore } from '../store'
import { CanvasSideEffects } from './CanvasSideEffects'
import { Cell } from './Cell'

export function Canvas() {
  const pixelWidth = useStore(state => state.spriteSize * state.width)
  const pixelsLen = useStore(state => state.pixels.length)
  const stopDragging = useStore(state => state.stopDragging)

  useEffect(() => {
    window.addEventListener('mouseup', stopDragging)
    window.addEventListener('blur', stopDragging)
    return () => {
      window.removeEventListener('mouseup', stopDragging)
      window.removeEventListener('blur', stopDragging)
    }
  }, [stopDragging])

  return (
    <Container $width={pixelWidth}>
      {Array(pixelsLen)
        .fill(null)
        .map((_, i) => (
          <Cell key={i} index={i}></Cell>
        ))}
      <CanvasSideEffects />
    </Container>
  )
}

const Container = styled.div<{ $width: number }>`
  background-color: lavender;
  display: grid;
  border: 1px solid lightgray;

  grid-template-columns: repeat(${p => p.$width}, minmax(0, 1fr));
  width: calc(var(--pixel-size) * ${p => p.$width});
`
