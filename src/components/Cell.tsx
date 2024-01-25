import { styled } from '@linaria/react'

import { useStore } from '../store'

interface Props {
  index: number
}

export function Cell({ index }: Props) {
  const palette = useStore(state => state.palette)
  const color = useStore(state => state.pixels[index])
  const setPixel = useStore(state => state.setPixel)

  return (
    <CellView $color={palette[color]} onMouseDown={() => setPixel(index)} />
  )
}

const CellView = styled.div<{ $color: string }>`
  aspect-ratio: 1;
  background-color: ${p => p.$color};
  box-sizing: content-box;

  &:hover {
    border: 2px dashed red;
  }
`
