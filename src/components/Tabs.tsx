import { styled } from '@linaria/react'
import { useState } from 'react'

import { Debug } from './Debug'
import { Export } from './Export'
import { Preview } from './Preview'
import { Settings } from './Settings'
import { ToolSettings } from './ToolSettings'

const tabs = [
  { name: 'ToolSettings', component: ToolSettings },
  { name: 'Settings', component: Settings },
  { name: 'Export', component: Export },
  { name: 'Preview', component: Preview },
  { name: 'Debug', component: Debug },
]

export function Tabs() {
  const [tab, setTab] = useState(0)

  const TabComponent = tabs[tab].component

  return (
    <Container>
      <div>
        {tabs.map(({ name }, i) => (
          <TabButton key={i} onClick={() => setTab(i)}>
            {name}
          </TabButton>
        ))}
      </div>
      <TabComponent />
    </Container>
  )
}

const Container = styled.div`
  flex: 0 1 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0px 16px;
`

const TabButton = styled.button``
