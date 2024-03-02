import { styled } from '@linaria/react'
import { ReactNode } from 'react'
import { LuWrench } from 'react-icons/lu'
import { Drawer } from 'vaul'

import { breakpoints } from '../breakpoints'
import { tabsData } from '../data'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useStore } from '../store/store'
import { getTooltipProps } from '../tooltips'
import { IconButton } from './IconButton'

const tabs = ['tool', 'settings', 'export', 'preview', 'info'] as const

export function Tabs() {
  const currentTab = useStore(state => state.tab)
  const setTab = useStore(state => state.setTab)

  const isMobile = !useMediaQuery(breakpoints.md)

  const TabComponent = tabsData[currentTab].component
  const ContainerComponent = isMobile ? Vaul : Container

  return (
    <ContainerComponent>
      <TabWrapper>
        {tabs.map(tab => {
          const Icon = tabsData[tab].icon
          return (
            <TabButton
              key={tab}
              onClick={() => setTab(tab)}
              $active={tab === currentTab}
              {...getTooltipProps(tabsData[tab].name, 'up-right')}
            >
              <Icon />
            </TabButton>
          )
        })}
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
