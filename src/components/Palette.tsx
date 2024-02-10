import { styled } from '@linaria/react'

import { useStore } from '../store'

export function Palette() {
  const palette = useStore(state => state.palette)
  const color = useStore(state => state.color)
  const setColor = useStore(state => state.setColor)
  const fillCanvas = useStore(state => state.fillCanvas)

  function handleButtonClick(e: React.MouseEvent, i: number) {
    if (e.ctrlKey) {
      fillCanvas(i)
      e.preventDefault()
    } else {
      setColor(i)
    }
  }

  return (
    <Container>
      {palette.map((c, i) => (
        <ColorButton
          $color={c}
          $selected={color === i}
          onClick={e => handleButtonClick(e, i)}
          aria-label={'Color #' + i}
          key={i}
        />
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ColorButton = styled.button<{ $color: string; $selected: boolean }>`
  cursor: pointer;
  background-color: ${p => p.$color};
  outline: ${p => (p.$selected ? '2px solid black' : 'none')};
  width: 32px;
  height: 32px;
  border: 1px solid lavender;
  border-radius: 4px;
  box-shadow: 2px 2px 0px lavender;
`
