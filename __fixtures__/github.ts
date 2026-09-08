import { jest } from '@jest/globals'

export const listTags =
  jest.fn<typeof import('../src/utils/github.js').listTags>()
