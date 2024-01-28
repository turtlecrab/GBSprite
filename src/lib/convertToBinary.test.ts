import { describe, expect, it } from 'vitest'

import { convertToBinary, numToHex } from './convertToBinary'

/**
 * ████████████████
 * ██▒▒░░░░▒▒░░░░██
 * ▒▒░░▓▓▓▓░░▓▓▓▓░░
 * ▒▒░░▓▓▓▓▓▓▓▓▓▓░░
 * ▒▒░░▓▓▓▓▓▓▓▓▓▓░░
 * ██▒▒░░▓▓▓▓▓▓░░██
 * ████▒▒░░▓▓░░████
 * ██████▒▒░░██████
 */
const heart = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 3, 3, 0, 2, 3, 1, 1, 3, 1, 1, 3, 2, 3,
  1, 1, 1, 1, 1, 3, 2, 3, 1, 1, 1, 1, 1, 3, 0, 2, 3, 1, 1, 1, 3, 0, 0, 0, 2, 3,
  1, 3, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0,
]

describe('convertToBinary', () => {
  it('throws on empty array', () => {
    expect(() => convertToBinary([])).toThrow()
  })
  it('converts 8 pixels to 2 bytes', () => {
    expect(convertToBinary([0, 0, 0, 0, 0, 0, 0, 0])).toEqual([0, 0])
    expect(convertToBinary([3, 3, 3, 3, 3, 3, 3, 3])).toEqual([255, 255])
    expect(convertToBinary([0, 1, 2, 3, 0, 0, 3, 3])).toEqual([83, 51])
  })
  it('converts 8x8 tile 💚', () => {
    expect(convertToBinary(heart)).toEqual([
      0x00, 0x00, 0x36, 0x7e, 0x7f, 0xc9, 0x7f, 0xc1, 0x7f, 0xc1, 0x3e, 0x62,
      0x1c, 0x34, 0x08, 0x18,
    ])
  })
})

describe('numToHex', () => {
  it('converts number to hex string', () => {
    expect(numToHex(0)).toBe('00')
    expect(numToHex(1)).toBe('01')
    expect(numToHex(16)).toBe('10')
    expect(numToHex(254)).toBe('fe')
    expect(numToHex(255)).toBe('ff')
  })
})
