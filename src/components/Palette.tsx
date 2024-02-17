import { styled } from '@linaria/react'

import { getLuminance } from '../lib/utils'
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
          onClick={e => handleButtonClick(e, i)}
          aria-label={'Color #' + i}
          key={i}
        >
          {color === i && <SelectedMarker $color={getContrastColor(c)} />}
        </ColorButton>
      ))}
    </Container>
  )
}

function getContrastColor(color: string): string {
  return getLuminance(color) > 128
    ? 'var(--contrast-black)'
    : 'var(--contrast-white)'
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ColorButton = styled.button<{ $color: string }>`
  cursor: pointer;
  background-color: ${p => p.$color};
  width: 32px;
  height: 32px;
  border: 1px solid ${p => p.$color};
  border-radius: 4px;
  box-shadow: 2px 2px 0px lavender;
  position: relative;
  overflow: hidden;
`

const SelectedMarker = styled.span<{ $color: string }>`
  position: absolute;
  background-color: ${p => p.$color};
  display: block;
  width: 24px;
  height: 24px;
  top: -14px;
  left: -14px;
  transform: rotate(45deg);
`
