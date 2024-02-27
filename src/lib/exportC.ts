import { asciiArt, convertToBinary, numToHex } from './convertToBinary'
import { chunk } from './utils'

// TODO: refactor with object args?, rewrite tests
export function exportC(
  pixels: number[],
  title: string,
  width = 1,
  mode: '8x8' | '8x16' = '8x8',
  withHeader = true,
  withConstants = true,
): string {
  // 1 tile (16 bytes) per line
  const data = chunk(convertToBinary(pixels, width, mode), 16)
    .map(
      tile =>
        '  ' +
        tile
          .map(numToHex)
          .map(h => `0x${h},`)
          .join(' '),
    )
    .join('\n')

  return (
    (withHeader ? getHeader(pixels, width, mode) : '') +
    (withConstants ? getConstants(pixels, title, width) : '') +
    `const unsigned char ${title}[] =\n{\n${data}\n};\n`
  )
}

export function exportH(
  pixels: number[],
  title: string,
  width: number,
  mode: '8x8' | '8x16',
  withHeader: boolean,
  withConstants: boolean,
) {
  return (
    (withHeader ? getHeader(pixels, width, mode) : '') +
    (withConstants ? getConstants(pixels, title, width) : '') +
    `extern const unsigned char ${title}[];\n`
  )
}

function getHeader(pixels: number[], width: number, mode: '8x8' | '8x16') {
  const tilesCount = pixels.length / 64

  return (
    '/**\n * made with GBSprite\n *\n' +
    ` * mode: ${mode}\n` +
    ` * tiles: ${tilesCount}\n` +
    ' *\n' +
    asciiArt(pixels, width * 8)
      .map(r => ` * ${r}\n`)
      .join('') +
    ' */\n\n'
  )
}

function getConstants(pixels: number[], title: string, width: number) {
  const tilesCount = pixels.length / 64
  const height = tilesCount / width

  return (
    `#define ${title}_size ${tilesCount}\n` +
    `#define ${title}_width ${width}\n` +
    `#define ${title}_height ${height}\n\n`
  )
}
