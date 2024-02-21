import { Listbox } from '@headlessui/react'
import { styled } from '@linaria/react'
import { useState } from 'react'
import { LuPalette } from 'react-icons/lu'
import { shallow } from 'zustand/shallow'

import { getLuminance } from '../lib/utils'
import { useStore } from '../store/store'

export function PaletteList() {
  const palette = useStore(state => state.palette)
  const setPalette = useStore(state => state.setPalette)

  const [selected, setSelected] = useState(
    palettesData.findIndex(p => shallow(p.colors, palette)) || 0,
  )

  function handleChange(next: number) {
    setSelected(next)
    setPalette(palettesData[next].colors)
  }

  return (
    <Container>
      <Listbox value={selected} onChange={handleChange}>
        <Listbox.Button>
          <LuPalette size="100%" />
        </Listbox.Button>
        <Listbox.Options>
          {palettesData.map((p, i) => (
            <Listbox.Option key={i} value={i}>
              <PaletteItem {...p} />
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </Container>
  )
}

function PaletteItem(props: (typeof palettesData)[number]) {
  return (
    <Item>
      {props.colors.map((c, i) => (
        <div
          key={i}
          style={{
            backgroundColor: c,
          }}
        />
      ))}
      <span>{props.name}</span>
    </Item>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-self: end;
  margin-bottom: 12px;

  & > button {
    cursor: pointer;
    background-color: white;
    width: 40px;
    height: 40px;
    border: 1px solid lavender;
    border-radius: 4px;
    box-shadow: 2px 2px 0px lavender;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
  }

  & > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    width: max-content;
    position: absolute;
    left: 48px;
    bottom: 0;
    z-index: 10;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 4px 8px var(--gray-8);

    li {
      &[data-headlessui-state*='active'] {
        background-color: lavender;
      }
      &[aria-selected='true'] {
        font-weight: bold;
      }
    }
  }
`

const Item = styled.div`
  display: flex;
  cursor: pointer;

  & > div {
    width: 24px;
    height: 24px;
    display: 'inline-block';
  }

  & > span {
    margin-inline: 4px;
  }
`

const palettesData = [
  {
    name: 'Nintendo Gameboy (bgb)',
    author: '',
    colors: ['#081820', '#346856', '#88c070', '#e0f8d0'],
  },
  {
    name: 'BLK AQU4',
    author: 'BurakoIRL',
    colors: ['#002b59', '#005f8c', '#00b9be', '#9ff4e5'],
  },
  {
    name: 'Links Awakening (SGB)',
    author: '',
    colors: ['#5a3921', '#6b8c42', '#7bc67b', '#ffffb5'],
  },
  {
    name: 'SpaceHaze',
    author: 'WildLeoKnight',
    colors: ['#f8e3c4', '#cc3495', '#6b1fb1', '#0b0630'],
  },
  {
    name: 'Wish GB',
    author: 'Kerrie Lake',
    colors: ['#622e4c', '#7550e8', '#608fcf', '#8be5ff'],
  },
  {
    name: '2-bit Grayscale',
    author: '',
    colors: ['#000000', '#676767', '#b6b6b6', '#ffffff'],
  },
  {
    name: '2bit demichrome',
    author: 'Space Sandwich',
    colors: ['#211e20', '#555568', '#a0a08b', '#e9efec'],
  },
  {
    name: 'Ice Cream GB',
    author: 'Kerrie Lake',
    colors: ['#7c3f58', '#eb6b6f', '#f9a875', '#fff6d3'],
  },
  {
    name: 'Kirokaze Gameboy',
    author: 'Kirokaze',
    colors: ['#332c50', '#46878f', '#94e344', '#e2f3e4'],
  },
  {
    name: 'Fiery Plague GB',
    author: 'Klafooty',
    colors: ['#1a2129', '#312137', '#512839', '#713141'],
  },
].map(p =>
  isPaletteReversed(p.colors) ? { ...p, colors: [...p.colors].reverse() } : p,
)

function isPaletteReversed(palettes: string[]): boolean {
  return getLuminance(palettes[0]) < getLuminance(palettes.at(-1)!)
}
