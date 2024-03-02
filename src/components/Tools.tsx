import { styled } from '@linaria/react'

import { toolsData } from '../data'
import { Tool, useStore } from '../store/store'
import { tooltips } from '../tooltips'
import { IconButton } from './IconButton'

const tools: Tool[] = ['pencil', 'bucket', 'rect', 'ellipse', 'move', 'hand']

export function Tools() {
  const tool = useStore(state => state.tool)
  const setTool = useStore(state => state.setTool)

  return (
    <Container>
      {tools.map(t => (
        <ToolButton
          $selected={tool === t}
          onClick={() => setTool(t)}
          key={t}
          tooltip={tooltips[t]}
        >
          <Icon tool={t as Tool} />
        </ToolButton>
      ))}
    </Container>
  )
}

function Icon({ tool }: { tool: Tool }) {
  if (!toolsData[tool]?.icon) {
    console.error('bad icon name')
    return <>😦</>
  }
  const Comp = toolsData[tool].icon
  return <Comp />
}

const Container = styled.div`
  display: flex;
  gap: 4px;
  margin: 4px 0;
`

const ToolButton = styled(IconButton)<{ $selected: boolean }>`
  background-color: ${p => (p.$selected ? 'orange' : 'white')};
`
