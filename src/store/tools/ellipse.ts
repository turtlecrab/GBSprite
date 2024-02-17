import { getPixelCoords } from '../../lib/utils'
import { Getter, Setter } from '../store'

export const ellipse = {
  startDragging(index: number, set: Setter, _get: Getter) {
    set({
      dragging: true,
      draggingFrom: index,
      draft: [[index]],
    })
  },
  hoverPixel(index: number, set: Setter, get: Getter) {
    if (!get().dragging || get().draggingFrom === null) return

    const width = get().width * get().tileSize

    const { x: x0, y: y0 } = getPixelCoords(get().draggingFrom!, width)
    const { x: x1, y: y1 } = getPixelCoords(index, width)

    set({ draft: [plotEllipseRect(x0, y0, x1, y1, width)] })
  },
}

/**
 * http://members.chello.at/easyfilter/bresenham.html#ellipse
 */
// TODO:
// - width 1-4,6: add top/bottom pixels?
// - filled version
function plotEllipseRect(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  width: number,
): number[] {
  let a = Math.abs(x1 - x0)
  let b = Math.abs(y1 - y0)
  let b1 = b & 1 /* values of diameter */

  let dx = 4 * (1 - a) * b * b
  let dy = 4 * (b1 + 1) * a * a /* error increment */

  let err = dx + dy + b1 * a * a
  let e2 /* error of 1.step */

  if (x0 > x1) {
    x0 = x1
    x1 += a
  } /* if called with swapped points */
  if (y0 > y1) {
    y0 = y1
    y1 += b
  } /* .. exchange them */

  y0 += Math.floor((b + 1) / 2)
  y1 = y0 - b1

  a *= 8 * a
  b1 = 8 * b * b

  const pixels: number[] = []
  const setPixel = (x: number, y: number) => pixels.push(y * width + x)

  do {
    setPixel(x1, y0) /*   I. Quadrant */
    setPixel(x0, y0) /*  II. Quadrant */
    setPixel(x0, y1) /* III. Quadrant */
    setPixel(x1, y1) /*  IV. Quadrant */
    e2 = 2 * err
    if (e2 <= dy) {
      y0++
      y1--
      err += dy += a
    } /* y step */
    if (e2 >= dx || 2 * err > dy) {
      x0++
      x1--
      err += dx += b1
    } /* x step */
  } while (x0 <= x1)

  while (y0 - y1 < b) {
    /* too early stop of flat ellipses a=1 */
    setPixel(x0 - 1, y0) /* -> finish tip of ellipse */
    setPixel(x1 + 1, y0++)
    setPixel(x0 - 1, y1)
    setPixel(x1 + 1, y1--)
  }
  return pixels
}
