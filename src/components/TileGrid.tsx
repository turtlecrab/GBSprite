import { styled } from '@linaria/react'

import { useStore } from '../store'

export function TileGrid() {
  const width = useStore(state => state.width)
  const height = useStore(state => state.height)

  return (
    <Container>
      <Cols>
        {Array(width - 1)
          .fill(null)
          .map((_, i) => (
            <Col key={i} />
          ))}
      </Cols>
      <Rows>
        {Array(height - 1)
          .fill(null)
          .map((_, i) => (
            <Row key={i} />
          ))}
      </Rows>
    </Container>
  )
}

const Container = styled.div`
  pointer-events: none;
`

const Cols = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-evenly;
`

const Col = styled.div`
  width: 2px;
  background-color: blue;
`

const Rows = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const Row = styled.div`
  height: 2px;
  background-color: blue;
`
