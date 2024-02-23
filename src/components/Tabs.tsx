import { styled } from '@linaria/react'
import { ReactNode, useState } from 'react'
import { LuWrench } from 'react-icons/lu'
import { Drawer } from 'vaul'

import { breakpoints } from '../breakpoints'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Debug } from './Debug'
import { Export } from './Export'
import { IconButton } from './IconButton'
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

  const isMobile = !useMediaQuery(breakpoints.md)

  const TabComponent = tabs[tab].component
  const ContainerComponent = isMobile ? Vaul : Container

  return (
    <ContainerComponent>
      <div>
        {tabs.map(({ name }, i) => (
          <TabButton key={i} onClick={() => setTab(i)}>
            {name}
          </TabButton>
        ))}
      </div>
      <TabComponent />
    </ContainerComponent>
  )
}

function Vaul(props: { children: ReactNode }) {
  return (
    <Drawer.Root>
      <IconButton as={Trigger}>
        <LuWrench />
      </IconButton>
      <Drawer.Portal>
        <Overlay />
        <Content>{props.children}</Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

const Container = styled.div`
  flex: 0 1 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0px 16px;
`

const Trigger = styled(Drawer.Trigger)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
`

const Overlay = styled(Drawer.Overlay)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #21252980;
`

const Content = styled(Drawer.Content)`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: 0;
  bottom: 0;
  left: 0;
  height: 60%;
  background-color: white;
  padding: 12px;
`

const TabButton = styled.button``
