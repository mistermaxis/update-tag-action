import { jest } from '@jest/globals'

export const listTags =
  jest.fn<typeof import('../src/utils/github.js').listTags>()
export const outputCommits =
  jest.fn<typeof import('../src/utils/github.js').outputCommits>()
