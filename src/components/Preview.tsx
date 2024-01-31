import { styled } from '@linaria/react'
import { useEffect, useRef, useState } from 'react'

import { useStore } from '../store'

export function Preview() {
  const pixels = useStore(state => state.pixels)
  const tileWidth = useStore(state => state.width)
  const tileHeight = useStore(state => state.height)
  const spriteSize = useStore(state => state.spriteSize)
  const palette = useStore(state => state.palette)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [isTiled, setIsTiled] = useState(true)

  const pixelWidth = spriteSize * tileWidth
  const pixelHeight = spriteSize * tileHeight

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

    const bytes = new Uint8ClampedArray(pixels.flatMap(toBytes))

    const data = new ImageData(bytes, pixelWidth, pixelHeight)

    if (!isTiled) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.putImageData(data, pixelWidth, pixelHeight)
    } else {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          ctx.putImageData(data, pixelWidth * i, pixelHeight * j)
        }
      }
    }
  }, [ctx, pixels, pixelWidth, pixelHeight, palette, isTiled])

  const [zoomFactor, setZoomFactor] = useState(2)
  const [isPixelPerfect, setIsPixelPerfect] = useState(true)
  const [ratio, setRatio] = useState(window.devicePixelRatio)

  const previewZoom = zoomFactor * (isPixelPerfect ? 1 / ratio : 1)

  useEffect(() => {
    function cb() {
      setRatio(window.devicePixelRatio)
    }
    window.addEventListener('resize', cb)
    return () => {
      window.removeEventListener('resize', cb)
    }
  }, [])

  return (
    <Container>
      <Controls>
        {[2, 4, 8, 16].map(n => (
          <button
            onClick={() => setZoomFactor(n)}
            key={n}
            style={n === zoomFactor ? { fontWeight: 'bold' } : {}}
          >
            {n}x
          </button>
        ))}
        <label>
          <input
            type="checkbox"
            checked={isPixelPerfect}
            onChange={e => setIsPixelPerfect(e.currentTarget.checked)}
          />{' '}
          Pixel-perfect
        </label>
        <label>
          <input
            type="checkbox"
            checked={isTiled}
            onChange={e => setIsTiled(e.currentTarget.checked)}
          />{' '}
          Tiled
        </label>
      </Controls>
      <CanvasWrapper
        $width={pixelWidth * previewZoom}
        $height={pixelHeight * previewZoom}
        $bg={palette[0]}
      >
        <canvas
          width={pixelWidth * 3}
          height={pixelHeight * 3}
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
  max-width: 90vw;
  overflow: auto;
`

const Controls = styled.div`
  display: flex;
  gap: 4px;

  button {
    padding: 2px 8px;
  }

  label {
    display: flex;
    align-items: center;
    margin-left: 8px;

    input[type='checkbox'] {
      width: 1rem;
      height: 1rem;
    }
  }
`

const CanvasWrapper = styled.div<{
  $width: number
  $height: number
  $bg: string
}>`
  background-color: ${p => p.$bg};
  padding: 16px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  canvas {
    image-rendering: pixelated;
    width: calc(${p => p.$width} * 3px);
    height: calc(${p => p.$height} * 3px);
  }
`
