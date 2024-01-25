import { styled } from '@linaria/react'

import { useStore } from '../store'

interface Props {
  index: number
}

export function Cell({ index }: Props) {
  const palette = useStore(state => state.palette)
  const color = useStore(state => state.pixels[index])
  const startDragging = useStore(state => state.startDragging)
  const hoverCell = useStore(state => state.hoverCell)

  function mouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    startDragging(index)
  }

  function mouseOver(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    hoverCell(index)
  }

  return (
    <CellView
      $color={palette[color]}
      onMouseDown={mouseDown}
      onMouseOver={mouseOver}
    />
  )
}

const CellView = styled.div<{ $color: string }>`
  aspect-ratio: 1;
  background-color: ${p => p.$color};
  box-sizing: content-box;
  cursor: crosshair;

  &:hover {
    border: 1px solid red;
  }
`
