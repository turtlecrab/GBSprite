export function convertToBinary(pixels: number[]): number[] {
  if (pixels.length === 0) throw new Error('Empty array received')

  const bytes: number[] = []

  for (let i = 0; i < pixels.length; i += 8) {
    const row = pixels.slice(i, i + 8)

    let firstByte = 0
    let secondByte = 0

    for (let pixel of row) {
      const mib = (pixel & 0b10) >> 1
      const lib = pixel & 0b01
      firstByte <<= 1
      firstByte += lib
      secondByte <<= 1
      secondByte += mib
    }
    bytes.push(firstByte, secondByte)
  }
  return bytes
}

export function numToHex(num: number): string {
  return num.toString(16).padStart(2, '0')
}

export function asciiArt(pixels: number[]): string[] {
  const result: string[] = []
  for (let i = 0; i < pixels.length; i += 8) {
    result.push(
      pixels
        .slice(i, i + 8)
        .map(p => ['██', '▓▓', '▒▒', '░░'][p])
        .join(''),
    )
  }
  return result
}
