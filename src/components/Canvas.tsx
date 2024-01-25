import { styled } from '@linaria/react'
import { useEffect } from 'react'

import { useStore } from '../store'
import { Cell } from './Cell'

export function Canvas() {
  const pixelWidth = useStore(state => state.spriteSize * state.width)
  const pixelsLen = useStore(state => state.pixels.length)
  const setDragging = useStore(state => state.setDragging)

  useEffect(() => {
    function stopDrag() {
      setDragging(false)
    }
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('blur', stopDrag)
    return () => {
      window.removeEventListener('mouseup', stopDrag)
      window.removeEventListener('blur', stopDrag)
    }
  }, [setDragging])

  return (
    <Container $width={pixelWidth}>
      {Array(pixelsLen)
        .fill(null)
        .map((_, i) => (
          <Cell key={i} index={i}></Cell>
        ))}
    </Container>
  )
}

const Container = styled.div<{ $width: number }>`
  background-color: lavender;
  display: grid;
  border: 1px solid lightgray;

  grid-template-columns: repeat(${p => p.$width}, minmax(0, 1fr));
  max-width: calc(var(--pixel-size) * ${p => p.$width});
`
