import { styled } from '@linaria/react'

import { useStore } from '../store'

interface Props {
  index: number
}

export function Pixel({ index }: Props) {
  const palette = useStore(state => state.palette)
  const color = useStore(state => state.pixels[index])
  const startDragging = useStore(state => state.startDragging)
  const hoverPixel = useStore(state => state.hoverPixel)

  function mouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    startDragging(index)
  }

  function mouseOver(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    hoverPixel(index)
  }

  return (
    <PixelView
      $color={palette[color]}
      onMouseDown={mouseDown}
      onMouseOver={mouseOver}
    />
  )
}

const PixelView = styled.div<{ $color: string }>`
  aspect-ratio: 1;
  background-color: ${p => p.$color};
  box-sizing: content-box;
  cursor: var(--cell-cursor);

  &:hover {
    background-color: var(--cell-hover-color, ${p => p.$color});
  }
`