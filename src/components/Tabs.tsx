import { styled } from '@linaria/react'
import { ReactNode, useState } from 'react'
import { LuBug, LuFileDown, LuSettings, LuView, LuWrench } from 'react-icons/lu'
import { Drawer } from 'vaul'

import { breakpoints } from '../breakpoints'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { getTooltipProps } from '../tooltips'
import { Debug } from './Debug'
import { Export } from './Export'
import { IconButton } from './IconButton'
import { Preview } from './Preview'
import { Settings } from './Settings'
import { ToolSettings } from './ToolSettings'

const tabs = [
  { name: 'Tool settings', component: ToolSettings, icon: LuWrench },
  { name: 'Settings', component: Settings, icon: LuSettings },
  { name: 'Export', component: Export, icon: LuFileDown },
  { name: 'Preview', component: Preview, icon: LuView },
  { name: 'Debug', component: Debug, icon: LuBug },
]

export function Tabs() {
  const [tab, setTab] = useState(0)

  const isMobile = !useMediaQuery(breakpoints.md)

  const TabComponent = tabs[tab].component
  const ContainerComponent = isMobile ? Vaul : Container

  return (
    <ContainerComponent>
      <TabWrapper>
        {tabs.map(({ name, icon: Icon }, i) => (
          <TabButton
            key={i}
            onClick={() => setTab(i)}
            $active={tab === i}
            {...getTooltipProps(name, 'up-right')}
          >
            <Icon />
          </TabButton>
        ))}
      </TabWrapper>
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
  flex: 0 1 240px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0px 16px;
`

const TabWrapper = styled.div`
  display: flex;
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

const TabButton = styled.button<{ $active: boolean }>`
  cursor: pointer;
  color: var(--gray-9);
  background-color: ${p => (p.$active ? 'white' : 'var(--gray-1)')};
  width: 40px;
  height: 40px;
  border: 2px solid var(--gray-3);
  border-radius: 4px 4px 0 0;
  border-bottom-color: ${p => (p.$active ? 'transparent' : 'var(--gray-2)')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  margin-left: -1px;

  & > svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.5px;
  }
`
