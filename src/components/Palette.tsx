import { styled } from '@linaria/react'
import { LuPaintBucket, LuPencil } from 'react-icons/lu'

import { Tool, useStore } from '../store'

const icons = {
  pencil: LuPencil,
  bucket: LuPaintBucket,
}

export function Palette() {
  const palette = useStore(state => state.palette)
  const color = useStore(state => state.color)
  const tool = useStore(state => state.tool)
  const setColor = useStore(state => state.setColor)
  const setTool = useStore(state => state.setTool)

  return (
    <Container>
      <div>
        {palette.map((c, i) => (
          <ColorButton
            $color={c}
            $selected={color === i}
            onClick={() => setColor(i)}
            aria-label={'Color #' + i}
            key={i}
          />
        ))}
      </div>
      <div>
        {['pencil', 'bucket'].map(t => (
          <ToolButton
            $selected={tool === t}
            onClick={() => setTool(t as Tool)}
            aria-label={t}
            key={t}
          >
            <Icon tool={t as Tool} />
          </ToolButton>
        ))}
      </div>
    </Container>
  )
}

function Icon({ tool }: { tool: Tool }) {
  if (!(tool in icons)) {
    console.error('bad icon name')
    return <>😦</>
  }
  const Comp = icons[tool]
  return <Comp size="100%" />
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

const ColorButton = styled.button<{ $color: string; $selected: boolean }>`
  cursor: pointer;
  background-color: ${p => p.$color};
  outline: ${p => (p.$selected ? '2px solid black' : 'none')};
  margin: 2px 2px 8px;
  width: 32px;
  height: 32px;
  border: 1px solid lavender;
  border-radius: 4px;
  box-shadow: 2px 2px 0px lavender;
`

const ToolButton = styled.button<{ $selected: boolean }>`
  cursor: pointer;
  background-color: ${p => (p.$selected ? 'orange' : 'white')};
  margin: 2px 2px 8px;
  width: 32px;
  height: 32px;
  border: 1px solid lavender;
  border-radius: 4px;
  box-shadow: 2px 2px 0px lavender;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`
