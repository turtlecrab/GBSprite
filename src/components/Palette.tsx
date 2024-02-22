import { styled } from '@linaria/react'

import { getLuminance } from '../lib/utils'
import { useStore } from '../store/store'
import { PaletteList } from './PaletteList'

export function Palette() {
  const palette = useStore(state => state.palette)
  const color = useStore(state => state.color)
  const bgColor = useStore(state => state.bgColor)
  const setColor = useStore(state => state.setColor)
  const setBGColor = useStore(state => state.setBGColor)
  const fillCanvas = useStore(state => state.fillCanvas)

  function handleButtonClick(e: React.MouseEvent, i: number) {
    if (e.ctrlKey) {
      fillCanvas(i)
      e.preventDefault()
    } else {
      if (e.button === 0) setColor(i)
      else if (e.button === 2) setBGColor(i)
    }
  }

  return (
    <Container>
      {palette.map((c, i) => (
        <ColorButton
          $color={c}
          onPointerDown={e => handleButtonClick(e, i)}
          aria-label={'Color #' + i}
          key={i}
          onContextMenu={e => e.preventDefault()}
        >
          {color === i && <SelectedMarker $color={getContrastColor(c)} />}
          {bgColor === i && <SelectedBGMarker $color={getContrastColor(c)} />}
        </ColorButton>
      ))}
      <Bottom>
        <PaletteList />
      </Bottom>
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
  margin: 0 12px;
`

const ColorButton = styled.button<{ $color: string }>`
  cursor: pointer;
  background-color: ${p => p.$color};
  width: 40px;
  height: 40px;
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
  top: -12px;
  left: -12px;
  transform: rotate(45deg);
`

const SelectedBGMarker = styled.span<{ $color: string }>`
  position: absolute;
  background-color: ${p => p.$color};
  display: block;
  width: 24px;
  height: 24px;
  bottom: -14px;
  right: -14px;
  transform: rotate(45deg);
`

const Bottom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
`
