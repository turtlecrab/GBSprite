import { styled } from '@linaria/react'

import { useStore } from '../store/store'
import { Checkbox } from './Checkbox'

const header = {
  pencil: 'Pencil',
  bucket: 'Paint Bucket',
  rect: 'Rectangle',
  ellipse: 'Ellipse',
  hand: 'Hand',
}

export function ToolSettings() {
  const tool = useStore(state => state.tool)
  const toolSettings = useStore(state => state.toolSettings)
  const setToolSettings = useStore(state => state.setToolSettings)
  const fitCanvas = useStore(state => state.fitCanvas)

  return (
    <Container>
      <h2>{header[tool]}</h2>
      {tool === 'pencil' && (
        <>
          <Checkbox
            value={toolSettings.pixelPerfectPencil}
            setValue={v => setToolSettings({ pixelPerfectPencil: v })}
          >
            Pixel-perfect
          </Checkbox>
        </>
      )}
      {tool === 'bucket' && (
        <>
          <Checkbox
            value={toolSettings.continuousBucket}
            setValue={v => setToolSettings({ continuousBucket: v })}
          >
            Continuous
          </Checkbox>
        </>
      )}
      {tool === 'rect' && (
        <>
          <Checkbox
            value={toolSettings.filledRect}
            setValue={v => setToolSettings({ filledRect: v })}
          >
            Filled
          </Checkbox>
        </>
      )}
      {tool === 'ellipse' && (
        <>
          <Checkbox
            value={toolSettings.filledEllipse}
            setValue={v => setToolSettings({ filledEllipse: v })}
          >
            Filled
          </Checkbox>
        </>
      )}
      {tool === 'hand' && (
        <>
          <button onClick={() => fitCanvas()}>Fit screen</button>
          <button onClick={() => fitCanvas('hor')}>Fit width</button>
          <button onClick={() => fitCanvas('vert')}>Fit height</button>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
