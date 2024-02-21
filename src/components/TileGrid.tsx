import { styled } from '@linaria/react'
import { memo, useEffect, useRef } from 'react'

import { useStore } from '../store/store'

const EDGE_WIDTH = '2px'
const EDGE_COLOR = 'blue'

export const TileGrid = memo(function TileGrid() {
  const width = useStore(state => state.width)
  const height = useStore(state => state.height)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    function setDevicePixel() {
      container.style.setProperty(
        '--device-pixel',
        String(window.devicePixelRatio),
      )
    }
    setDevicePixel()
    window.addEventListener('resize', setDevicePixel)
    return () => {
      window.removeEventListener('resize', setDevicePixel)
    }
  }, [])

  return (
    <Container ref={containerRef}>
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
})

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
  width: calc(${EDGE_WIDTH} / var(--device-pixel));
  background-color: ${EDGE_COLOR};
`

const Rows = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const Row = styled.div`
  height: calc(${EDGE_WIDTH} / var(--device-pixel));
  background-color: ${EDGE_COLOR};
`
