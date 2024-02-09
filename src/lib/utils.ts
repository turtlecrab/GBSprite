/**
 * Generates an array of pixel indices representing a line between two points
 * using Bresenham's line algorithm (modified to preserve the line direction)
 *
 * https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm#All_cases
 */
export function getLine(
  startIndex: number | null,
  endIndex: number,
  width: number,
): number[] {
  if (startIndex === null || startIndex === endIndex)
    return [endIndex, endIndex]

  const { x: x0, y: y0 } = getPixelCoords(startIndex, width)
  const { x: x1, y: y1 } = getPixelCoords(endIndex, width)

  if (Math.abs(y1 - y0) < Math.abs(x1 - x0))
    if (x0 > x1) {
      return getLineLow(x1, y1, x0, y0, width).reverse()
    } else {
      return getLineLow(x0, y0, x1, y1, width)
    }
  else if (y0 > y1) {
    return getLineHigh(x1, y1, x0, y0, width).reverse()
  } else {
    return getLineHigh(x0, y0, x1, y1, width)
  }
}

function getLineLow(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  width: number,
) {
  const result: number[] = []

  const dx = x1 - x0
  let dy = y1 - y0

  let yi = 1

  if (dy < 0) {
    yi = -1
    dy = -dy
  }

  let D = 2 * dy - dx
  let y = y0

  for (let x = x0; x <= x1; x++) {
    result.push(y * width + x)

    if (D > 0) {
      y = y + yi
      D = D + 2 * (dy - dx)
    } else {
      D = D + 2 * dy
    }
  }
  return result
}

function getLineHigh(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  width: number,
) {
  const result: number[] = []

  let dx = x1 - x0
  let dy = y1 - y0

  let xi = 1

  if (dx < 0) {
    xi = -1
    dx = -dx
  }

  let D = 2 * dx - dy
  let x = x0

  for (let y = y0; y <= y1; y++) {
    result.push(y * width + x)

    if (D > 0) {
      x = x + xi
      D = D + 2 * (dx - dy)
    } else {
      D = D + 2 * dx
    }
  }
  return result
}

export function getPixelCoords(index: number, width: number) {
  return {
    x: index % width,
    y: (index - (index % width)) / width,
  }
}

export function arePixelsAdjacent(
  index1: number,
  index2: number,
  width: number,
): boolean {
  const { x: x1, y: y1 } = getPixelCoords(index1, width)
  const { x: x2, y: y2 } = getPixelCoords(index2, width)
  const result =
    (Math.abs(x1 - x2) === 1 && y1 === y2) ||
    (Math.abs(y1 - y2) === 1 && x1 === x2)
  return result
}
