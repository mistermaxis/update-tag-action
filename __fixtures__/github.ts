import { jest } from '@jest/globals'

class Context {
  get repo(): { owner: string; repo: string } {
    return { owner: 'owner', repo: 'repo' }
  }
}

export const context = new Context()

export const getOctokit = jest.fn()
