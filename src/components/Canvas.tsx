import { styled } from '@linaria/react'
import { useEffect, useRef } from 'react'

import { useStore } from '../store'
import { CanvasSideEffects } from './CanvasSideEffects'
import { Cell } from './Cell'
import { TileGrid } from './TileGrid'

export function Canvas() {
  const pixelWidth = useStore(state => state.spriteSize * state.width)
  const pixelsLen = useStore(state => state.pixels.length)
  const stopDragging = useStore(state => state.stopDragging)
  const gridVisible = useStore(state => state.gridVisible)

  useEffect(() => {
    window.addEventListener('mouseup', stopDragging)
    window.addEventListener('blur', stopDragging)
    return () => {
      window.removeEventListener('mouseup', stopDragging)
      window.removeEventListener('blur', stopDragging)
    }
  }, [stopDragging])

  const contRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contRef.current) {
      const container = contRef.current
      const preventDefault = (e: MouseEvent) => e.preventDefault()

      container.addEventListener('contextmenu', preventDefault)
      return () => {
        container.addEventListener('contextmenu', preventDefault)
      }
    }
  }, [])

  return (
    <Container $width={pixelWidth} ref={contRef}>
      {Array(pixelsLen)
        .fill(null)
        .map((_, i) => (
          <Cell key={i} index={i}></Cell>
        ))}
      {gridVisible && <TileGrid />}
      <CanvasSideEffects />
    </Container>
  )
}

const Container = styled.div<{ $width: number }>`
  position: relative;
  background-color: lavender;
  display: grid;
  border: 1px solid lightgray;

  grid-template-columns: repeat(${p => p.$width}, minmax(0, 1fr));
  width: calc(var(--pixel-size) * ${p => p.$width});
`
