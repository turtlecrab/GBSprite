// TODO: add tests, refactor?
export function convertToBinary(
  pixels: number[],
  width = 1,
  mode: '8x8' | '8x16' = '8x8',
): number[] {
  if (pixels.length === 0) throw new Error('Empty array received')
  if (pixels.length % 64 !== 0) throw new Error('Length % 64 != 0')

  const height = pixels.length / (width * 64)
  if (mode === '8x16' && height % 2 !== 0)
    throw new Error('8x16 mode works with even heights only')

  return chunkByTile(pixels, width, mode).flatMap(pixelsToBinary)
}

export function pixelsToBinary(pixels: number[]): number[] {
  if (pixels.length === 0) throw new Error('Empty array received')
  if (pixels.length % 8 !== 0) throw new Error('Length % 8 != 0')

  const bytes: number[] = []

  for (let i = 0; i < pixels.length; i += 8) {
    const row = pixels.slice(i, i + 8)

    let firstByte = 0
    let secondByte = 0

    for (let pixel of row) {
      const msb = (pixel & 0b10) >> 1
      const lsb = pixel & 0b01
      firstByte <<= 1
      firstByte += lsb
      secondByte <<= 1
      secondByte += msb
    }
    bytes.push(firstByte, secondByte)
  }
  return bytes
}

export function numToHex(num: number): string {
  return num.toString(16).padStart(2, '0')
}

export function asciiArt(pixels: number[], pixelWidth: number): string[] {
  const result: string[] = []
  for (let i = 0; i < pixels.length; i += pixelWidth) {
    result.push(
      pixels
        .slice(i, i + pixelWidth)
        .map(p => ['██', '▓▓', '▒▒', '░░'][p])
        .join(''),
    )
  }
  return result
}

function chunkByTile(
  pixels: number[],
  width: number,
  mode: '8x8' | '8x16',
): number[][] {
  const totalTiles = pixels.length / 64
  const pixelWidth = width * 8

  const tiles = []

  for (let tileIndex = 0; tileIndex < totalTiles; tileIndex++) {
    const tile: number[] = []

    const startIndex = getTileStartIndex(tileIndex, width, mode)

    for (let row = 0; row < 8; row++) {
      const rowStartIndex = startIndex + row * pixelWidth
      const rowPixels = pixels.slice(rowStartIndex, rowStartIndex + 8)
      tile.push(...rowPixels)
    }
    tiles.push(tile)
  }
  return tiles
}

function getTileStartIndex(
  tileIndex: number,
  width: number,
  mode: '8x8' | '8x16',
): number {
  if (mode === '8x8') {
    const startCol = (tileIndex % width) * 8
    const startRow = Math.floor(tileIndex / width) * 8
    return startRow * width * 8 + startCol
  } else {
    const startCol = (Math.floor(tileIndex / 2) % width) * 8
    const startRow =
      (Math.floor(tileIndex / (2 * width)) * 2 + (tileIndex & 1)) * 8
    return startRow * width * 8 + startCol
  }
}
