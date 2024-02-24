export const tooltips = {
  colorSwatch: (index: number) =>
    `Color ${index}\n\nLMB: select color\nRMB: select BG color\nCtrl+click: fill canvas`,
  undo: `Undo\n\nCtrl+Z`,
  redo: `Redo\n\nCtrl+Y\nCtrl+Shift+Z`,
  zoomIn: `Zoom in\n\n+`,
  zoomOut: `Zoom out\n\n-`,
  pencil: `Pencil\n\nB`,
  bucket: `Paint bucket\n\nG`,
  rect: `Rectangle\n\nU`,
  ellipse: `Ellipse\n\nShift+U`,
  hand: `Hand\n\nH`,
}

export type TooltipPosition =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right'

export function getTooltipProps(tooltip: string, pos?: TooltipPosition) {
  return {
    'aria-label': tooltip,
    'data-balloon-pos': pos || 'down',
    'data-balloon-blunt': true,
    'data-balloon-nofocus': true,
  }
}
