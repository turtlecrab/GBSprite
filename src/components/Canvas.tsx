import { styled } from '@linaria/react'
import { useEffect, useRef, useState } from 'react'

import { getPixelCoords } from '../lib/utils'
import { useStore } from '../store'
import { CanvasSideEffects } from './CanvasSideEffects'
import { TileGrid } from './TileGrid'

export function Canvas() {
  const pixels = useStore(state => state.pixels)
  const tileWidth = useStore(state => state.width)
  const tileHeight = useStore(state => state.height)
  const spriteSize = useStore(state => state.spriteSize)
  const palette = useStore(state => state.palette)
  const gridVisible = useStore(state => state.gridVisible)
  const color = useStore(state => state.color)
  const lastHoveredPixel = useStore(state => state.lastHoveredPixel)
  const altPressed = useStore(state => state.altPressed)
  const draft = useStore(state => state.draft)
  const startDragging = useStore(state => state.startDragging)
  const stopDragging = useStore(state => state.stopDragging)
  const hoverPixel = useStore(state => state.hoverPixel)
  const clearLastHoveredPixel = useStore(state => state.clearLastHoveredPixel)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draftRef = useRef<HTMLCanvasElement>(null)

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [draftCtx, setDraftCtx] = useState<CanvasRenderingContext2D | null>(
    null,
  )

  const pixelWidth = spriteSize * tileWidth
  const pixelHeight = spriteSize * tileHeight

  useEffect(() => {
    if (!canvasRef.current) return
    setCtx(canvasRef.current.getContext('2d')!)
  }, [])

  useEffect(() => {
    if (!draftRef.current) return
    setDraftCtx(draftRef.current.getContext('2d')!)
  }, [])

  const bytesRef = useRef<Uint8ClampedArray | null>(null)
  const dataRef = useRef<ImageData | null>(null)

  useEffect(() => {
    if (!ctx) return

    if (
      !bytesRef.current ||
      !dataRef.current ||
      dataRef.current.width !== pixelWidth ||
      dataRef.current.height !== pixelHeight
    ) {
      bytesRef.current = new Uint8ClampedArray(pixelWidth * pixelHeight * 4)
      dataRef.current = new ImageData(bytesRef.current, pixelWidth, pixelHeight)
    }

    const paletteNumeric = palette.map(hex =>
      hex
        .match(/^#(..)(..)(..)$/)!
        .slice(1)
        .map(v => parseInt(v, 16)),
    )

    for (let i = 0; i < pixels.length; i++) {
      const [r, g, b] = paletteNumeric[pixels[i]]
      const offset = i * 4
      bytesRef.current[offset] = r
      bytesRef.current[offset + 1] = g
      bytesRef.current[offset + 2] = b
      bytesRef.current[offset + 3] = 255
    }

    ctx.putImageData(dataRef.current, 0, 0)
  }, [ctx, palette, pixelHeight, pixelWidth, pixels])

  useEffect(() => {
    if (!draftCtx) return

    draftCtx.clearRect(0, 0, pixelWidth, pixelHeight)

    draftCtx.fillStyle = palette[color]

    new Set(draft.flat()).forEach(p => {
      const { x, y } = getPixelCoords(p, pixelWidth)
      draftCtx.fillRect(x, y, 1, 1)
    })

    if (lastHoveredPixel !== null && !altPressed) {
      const { x, y } = getPixelCoords(lastHoveredPixel, pixelWidth)
      draftCtx.fillRect(x, y, 1, 1)
    }
  }, [
    draftCtx,
    pixelWidth,
    pixelHeight,
    palette,
    color,
    lastHoveredPixel,
    draft,
    altPressed,
  ])

  function pointerDown(e: React.PointerEvent) {
    e.preventDefault()
    const { x, y } = getPointerPixelCoords(e, pixelWidth, pixelHeight)
    startDragging(y * pixelWidth + x)
  }

  function pointerMove(e: React.PointerEvent) {
    const { x, y } = getPointerPixelCoords(e, pixelWidth, pixelHeight)
    hoverPixel(y * pixelWidth + x)
  }

  useEffect(() => {
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('blur', stopDragging)
    return () => {
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('blur', stopDragging)
    }
  }, [stopDragging])

  return (
    <Container>
      <MainCanvas
        width={pixelWidth}
        height={pixelHeight}
        ref={canvasRef}
        onPointerMove={pointerMove}
        onPointerDown={pointerDown}
        onPointerLeave={clearLastHoveredPixel}
      />
      <DraftCanvas width={pixelWidth} height={pixelHeight} ref={draftRef} />
      {gridVisible && <TileGrid />}
      <CanvasSideEffects />
    </Container>
  )
}

function getPointerPixelCoords(e: React.PointerEvent, w: number, h: number) {
  const rect = e.currentTarget.getBoundingClientRect()
  // x, y can be negative for some reason, hence Math.max
  // TODO: investigate, clamp right/bottom?
  const x = Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * w))
  const y = Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * h))

  return { x, y }
}

const Container = styled.div`
  position: relative;
  display: flex;
  border: 1px solid lightgray;
`

const MainCanvas = styled.canvas<{ width: number; height: number }>`
  image-rendering: pixelated;
  width: calc(${p => p.width} * var(--pixel-size));
  height: calc(${p => p.height} * var(--pixel-size));

  cursor: var(--canvas-cursor);
`

const DraftCanvas = styled.canvas<{ width: number; height: number }>`
  image-rendering: pixelated;
  width: calc(${p => p.width} * var(--pixel-size));
  height: calc(${p => p.height} * var(--pixel-size));

  position: absolute;
  pointer-events: none;
`
