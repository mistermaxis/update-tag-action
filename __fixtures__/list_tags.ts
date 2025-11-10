import { jest } from '@jest/globals'

export const listTags =
  jest.fn<typeof import('../src/utils/list_tags.js').listTags>()
