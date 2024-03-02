import {
  LuBug,
  LuCircle,
  LuFileDown,
  LuHand,
  LuInfo,
  LuMove,
  LuPaintBucket,
  LuPencil,
  LuRectangleHorizontal,
  LuSettings,
  LuView,
  LuWrench,
} from 'react-icons/lu'

import { Debug } from './components/Debug'
import { Export } from './components/Export'
import { Info } from './components/Info'
import { Preview } from './components/Preview'
import { Settings } from './components/Settings'
import { ToolSettings } from './components/ToolSettings'

export const tabsData = {
  tool: { name: 'Tool settings', component: ToolSettings, icon: LuWrench },
  settings: { name: 'Settings', component: Settings, icon: LuSettings },
  export: { name: 'Export', component: Export, icon: LuFileDown },
  preview: { name: 'Preview', component: Preview, icon: LuView },
  debug: { name: 'Debug', component: Debug, icon: LuBug },
  info: { name: 'Info', component: Info, icon: LuInfo },
}

export const toolsData = {
  pencil: {
    name: 'Pencil',
    cursor: 'crosshair',
    icon: LuPencil,
  },
  bucket: {
    name: 'Paint Bucket',
    cursor: 'crosshair',
    icon: LuPaintBucket,
  },
  rect: {
    name: 'Rectangle',
    cursor: 'crosshair',
    icon: LuRectangleHorizontal,
  },
  ellipse: {
    name: 'Ellipse',
    cursor: 'crosshair',
    icon: LuCircle,
  },
  hand: {
    name: 'Hand',
    cursor: 'grab',
    icon: LuHand,
  },
  move: {
    name: 'Move',
    cursor: 'move',
    icon: LuMove,
  },
}
