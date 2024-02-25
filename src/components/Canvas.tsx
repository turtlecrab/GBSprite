import { styled } from '@linaria/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LuMaximize2 } from 'react-icons/lu'

import { clamp, getPixelCoords } from '../lib/utils'
import { Tool, useStore } from '../store/store'
import { IconButton } from './IconButton'
import { TileGrid } from './TileGrid'

export function Canvas() {
  const pixels = useStore(state => state.pixels)
  const tileWidth = useStore(state => state.width)
  const tileHeight = useStore(state => state.height)
  const tileSize = useStore(state => state.tileSize)
  const palette = useStore(state => state.palette)
  const gridVisible = useStore(state => state.gridVisible)
  const color = useStore(state => state.color)
  const bgColor = useStore(state => state.bgColor)
  const dragging = useStore(state => state.dragging)
  const lastHoveredPixel = useStore(state => state.lastHoveredPixel)
  const altPressed = useStore(state => state.altPressed)
  const draft = useStore(state => state.draft)
  const tool = useStore(state => state.tool)
  const canvasPos = useStore(state => state.canvasPos)
  const zoom = useStore(state => state.zoom)
  const moveOffset = useStore(state => state.moveOffset)
  const startDragging = useStore(state => state.startDragging)
  const stopDragging = useStore(state => state.stopDragging)
  const hoverPixel = useStore(state => state.hoverPixel)
  const clearLastHoveredPixel = useStore(state => state.clearLastHoveredPixel)
  const changeZoom = useStore(state => state.changeZoom)
  const moveCanvasPos = useStore(state => state.moveCanvasPos)
  const fitCanvas = useStore(state => state.fitCanvas)
  const setContainer = useStore(state => state.setContainer)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draftRef = useRef<HTMLCanvasElement>(null)

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [draftCtx, setDraftCtx] = useState<CanvasRenderingContext2D | null>(
    null,
  )

  const pixelWidth = tileSize * tileWidth
  const pixelHeight = tileSize * tileHeight

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

    // TODO
    if (moveOffset) {
      for (let spriteOffset of [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ])
        ctx.putImageData(
          dataRef.current,
          pixelWidth * spriteOffset[0] + (moveOffset.x % pixelWidth),
          pixelHeight * spriteOffset[1] + (moveOffset.y % pixelHeight),
        )
    } else {
      ctx.putImageData(dataRef.current, 0, 0)
    }
  }, [ctx, palette, pixelHeight, pixelWidth, pixels, moveOffset])

  useEffect(() => {
    if (!draftCtx) return

    draftCtx.clearRect(0, 0, pixelWidth, pixelHeight)

    draftCtx.fillStyle =
      dragging === 'right' ? palette[bgColor ?? 0] : palette[color]

    new Set(draft.flat()).forEach(p => {
      const { x, y } = getPixelCoords(p, pixelWidth)
      draftCtx.fillRect(x, y, 1, 1)
    })

    // TODO
    if (
      lastHoveredPixel !== null &&
      !altPressed &&
      tool !== 'hand' &&
      tool !== 'move' &&
      (tool !== 'ellipse' || !draft.length)
    ) {
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
    tool,
    dragging,
    bgColor,
  ])

  function pointerDown(e: React.PointerEvent) {
    e.preventDefault()
    if (e.button < 0 || e.button > 2) return
    const button = (['left', 'middle', 'right'] as const)[e.button]

    const { x, y } = getPointerPixelCoords(e, pixelWidth, pixelHeight)
    startDragging(y * pixelWidth + x, button)
  }

  function pointerMove(e: React.PointerEvent) {
    const { x, y } = getPointerPixelCoords(e, pixelWidth, pixelHeight)
    hoverPixel(y * pixelWidth + x, e.movementX, e.movementY)
  }

  useEffect(() => {
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('blur', stopDragging)
    return () => {
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('blur', stopDragging)
    }
  }, [stopDragging])

  const contRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contRef.current) return
    const container = contRef.current

    const observer = new ResizeObserver(() => {
      setContainer(container.getBoundingClientRect())
    })

    observer.observe(container)
    return () => {
      observer.disconnect()
    }
  }, [setContainer])

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()

      if (e.ctrlKey) {
        // TODO: how to distinguish mouse/touch wheel?
        const factor = Math.abs(e.deltaY) > 50 ? 0.05 : 0.1
        changeZoom(e.deltaY * factor)
      } else {
        moveCanvasPos({
          x: e.deltaX,
          y: e.deltaY,
        })
      }
    },
    [changeZoom, moveCanvasPos],
  )

  useEffect(() => {
    if (!contRef.current) return
    const cont = contRef.current

    cont.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      cont.removeEventListener('wheel', onWheel)
    }
  }, [onWheel])

  return (
    <Container ref={contRef} onContextMenu={e => e.preventDefault()}>
      <CanvasWrapper
        style={
          {
            left: `${canvasPos.left}%`,
            top: `${canvasPos.top}%`,
            '--pixel-size': `${zoom}px`,
            cursor: getCursor(altPressed, dragging, tool),
          } as React.CSSProperties
        }
      >
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
      </CanvasWrapper>
      <FitCanvasButton onClick={() => fitCanvas()}>
        <LuMaximize2 size="100%" />
      </FitCanvasButton>
    </Container>
  )
}

function getPointerPixelCoords(e: React.PointerEvent, w: number, h: number) {
  const rect = e.currentTarget.getBoundingClientRect()
  // x, y can be negative for some reason, hence clamp
  // TODO: investigate
  const x = clamp(
    0,
    w - 1,
    Math.floor(((e.clientX - rect.left) / rect.width) * w),
  )
  const y = clamp(
    0,
    h - 1,
    Math.floor(((e.clientY - rect.top) / rect.height) * h),
  )

  return { x, y }
}

const cursors = {
  pencil: 'crosshair',
  bucket: 'crosshair',
  rect: 'crosshair',
  ellipse: 'crosshair',
  hand: 'grab',
  move: 'move',
}

function getCursor(altPressed: boolean, dragging: string | null, tool: Tool) {
  const isHandDrag = dragging === 'middle' || (tool === 'hand' && dragging)
  return altPressed ? 'alias' : isHandDrag ? 'grabbing' : cursors[tool]
}

const Container = styled.div`
  background-color: var(--gray-1);
  overflow: hidden;
  flex: 1;
  position: relative;
  touch-action: none;
`

const CanvasWrapper = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  border: 1px solid lightgray;
`

const MainCanvas = styled.canvas<{ width: number; height: number }>`
  image-rendering: pixelated;
  width: calc(${p => p.width} * var(--pixel-size));
  height: calc(${p => p.height} * var(--pixel-size));
`

const DraftCanvas = styled.canvas<{ width: number; height: number }>`
  image-rendering: pixelated;
  width: calc(${p => p.width} * var(--pixel-size));
  height: calc(${p => p.height} * var(--pixel-size));

  position: absolute;
  pointer-events: none;
`

const FitCanvasButton = styled(IconButton)`
  position: absolute;
  right: 12px;
  bottom: 12px;
`
