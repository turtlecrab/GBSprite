import { styled } from '@linaria/react'

import { useStore } from '../store'

export function Palette() {
  const palette = useStore(state => state.palette)
  const color = useStore(state => state.color)
  const setColor = useStore(state => state.setColor)

  return (
    <Container>
      <div>
        {palette.map((c, i) => (
          <ColorButton $color={c} key={i} onClick={() => setColor(i)}>
            {i.toString().padStart(2, '0')}
          </ColorButton>
        ))}
      </div>
      <SelectedColor $color={palette[color]} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

const ColorButton = styled.button<{ $color: string }>`
  background-color: ${p => p.$color};
  margin: 2px 2px 8px;
  border: 1px solid lightgray;
  border-radius: 4px;
`

const SelectedColor = styled.div<{ $color: string }>`
  background-color: ${p => p.$color};
  width: 32px;
  height: 32px;
  margin: 0 0 6px 64px;
  border: 1px solid lavender;
  border-radius: 4px;
  box-shadow: 2px 2px 0px lavender;
`
