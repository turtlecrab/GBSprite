import { styled } from '@linaria/react'
import { useEffect, useRef, useState } from 'react'

import { breakpoints } from '../breakpoints'
import { useStore } from '../store/store'
import { Checkbox } from './Checkbox'

export function Preview() {
  const pixels = useStore(state => state.pixels)
  const tileWidth = useStore(state => state.width)
  const tileHeight = useStore(state => state.height)
  const tileSize = useStore(state => state.tileSize)
  const palette = useStore(state => state.palette)
  const zoom = useStore(state => state.previewSettings.zoom)
  const zoomLevels = useStore(state => state.previewSettings.zoomLevels)
  const isDevicePixel = useStore(state => state.previewSettings.isDevicePixel)
  const tiledFactor = useStore(state => state.previewSettings.tiledFactor)
  const setPreviewSettings = useStore(state => state.setPreviewSettings)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  const pixelWidth = tileSize * tileWidth
  const pixelHeight = tileSize * tileHeight

  useEffect(() => {
    if (!canvasRef.current) return
    setCtx(canvasRef.current.getContext('2d')!)
  }, [canvasRef])

  useEffect(() => {
    if (!ctx) return

    function toBytes(c: number) {
      const [, r, g, b] = palette[c]
        .match(/^#(.{2})(.{2})(.{2})$/)!
        .map(v => parseInt(v, 16))
      return [r, g, b, 255]
    }

    // TODO: refactor to use data from the drawing canvas
    // (via separate store?)
    const bytes = new Uint8ClampedArray(pixels.flatMap(toBytes))

    const data = new ImageData(bytes, pixelWidth, pixelHeight)

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for (let i = 0; i < tiledFactor; i++) {
      for (let j = 0; j < tiledFactor; j++) {
        ctx.putImageData(data, pixelWidth * i, pixelHeight * j)
      }
    }
  }, [ctx, pixels, pixelWidth, pixelHeight, palette, tiledFactor])

  const [ratio, setRatio] = useState(window.devicePixelRatio)

  const zoomFactor = zoom * (isDevicePixel ? 1 / ratio : 1)

  useEffect(() => {
    function onResize() {
      setRatio(window.devicePixelRatio)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <Container>
      <Controls>
        {zoomLevels.map(n => (
          <button
            onClick={() => setPreviewSettings({ zoom: n })}
            key={n}
            style={n === zoom ? { fontWeight: 'bold' } : {}}
          >
            {n}x
          </button>
        ))}
      </Controls>
      <Controls>
        <Checkbox
          value={isDevicePixel}
          setValue={v => setPreviewSettings({ isDevicePixel: v })}
        >
          Device pixel
        </Checkbox>
        <Checkbox
          value={tiledFactor === 1}
          setValue={() => setPreviewSettings({ tiledFactor: 1 })}
        >
          1
        </Checkbox>
        <Checkbox
          value={tiledFactor === 3}
          setValue={() => setPreviewSettings({ tiledFactor: 3 })}
        >
          3
        </Checkbox>
      </Controls>
      <CanvasWrapper
        $width={pixelWidth * tiledFactor * zoomFactor}
        $height={pixelHeight * tiledFactor * zoomFactor}
        $bg={palette[0]}
      >
        <canvas
          width={pixelWidth * tiledFactor}
          height={pixelHeight * tiledFactor}
          ref={canvasRef}
        />
      </CanvasWrapper>
    </Container>
  )
}

const Container = styled.div`
  margin-top: 16px;
  gap: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`

const Controls = styled.div`
  display: flex;
  gap: 4px;

  & > button {
    padding: 2px 8px;
  }
`

const CanvasWrapper = styled.div<{
  $width: number
  $height: number
  $bg: string
}>`
  background-color: ${p => p.$bg};
  padding: 16px;
  max-width: 90vw;
  overflow: auto;

  @media ${breakpoints.md} {
    max-width: 50vw;
  }

  canvas {
    image-rendering: pixelated;
    width: calc(${p => p.$width} * 1px);
    height: calc(${p => p.$height} * 1px);
  }
`
