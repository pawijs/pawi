import { randomFillSync } from 'crypto'

const crypto = {
  getRandomValues: randomFillSync,
}

// @ts-ignore
global.crypto = crypto
