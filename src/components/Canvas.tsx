import { styled } from '@linaria/react'

import { useStore } from '../store'
import { Cell } from './Cell'

export function Canvas() {
  const width = useStore(state => state.width)
  const pixelsLen = useStore(state => state.pixels.length)

  return (
    <Container $width={width}>
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

  grid-template-columns: repeat(${p => p.$width * 8}, minmax(0, 1fr));
  max-width: calc(var(--pixel-size) * ${p => p.$width * 8});
`
