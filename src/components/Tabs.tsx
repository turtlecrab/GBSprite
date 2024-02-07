import { styled } from '@linaria/react'
import { useState } from 'react'

import { Debug } from './Debug'
import { Export } from './Export'
import { Preview } from './Preview'
import { Settings } from './Settings'

const tabs = [
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`

const TabButton = styled.button``
