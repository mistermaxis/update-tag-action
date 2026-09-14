import { jest, describe, it, expect, afterEach } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as github from '../__fixtures__/octokit.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { outputCommits } = await import('../src/utils/github.js')

describe('Output Commit List', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })
  it('Return the list of commit messages for a pull request event', async () => {
    github.getOctokit.mockImplementation(() => {
      return {
        rest: {
          pulls: {
            listCommits: jest.fn().mockReturnValue({
              data: [
                {
                  sha: 'mockId',
                  html_url: 'https://mockurl.com',
                  commit: {
                    message: 'mockMessage'
                  }
                }
              ]
            })
          }
        }
      }
    })

    github.context.eventName = 'pull_request'

    await outputCommits()

    expect(core.setOutput).toHaveBeenCalledWith(
      'changelog',
      '- mockMessage - mockId'
    )
  })

  it('Return the list of commit messages for a push event', async () => {
    github.context.eventName = 'push'

    github.context.payload = {
      commits: [
        {
          id: 'mockId',
          message: 'mockMessage'
        }
      ]
    }

    await outputCommits()

    expect(core.setOutput).toHaveBeenCalledWith(
      'changelog',
      '- mockMessage - mockId'
    )
  })

  it('Return an empty string if there are no commits on a push event', async () => {
    github.context.eventName = 'push'
    github.context.payload = { commits: undefined }

    await outputCommits()

    expect(core.setOutput).toHaveBeenCalledWith('changelog', '')
  })

  it('Return an empty string if there are no commits on a pull request event', async () => {
    github.getOctokit.mockImplementation(() => {
      return {
        rest: {
          pulls: {
            listCommits: jest.fn().mockReturnValue({
              data: []
            })
          }
        }
      }
    })

    github.context.eventName = 'pull_request'

    await outputCommits()

    expect(core.setOutput).toHaveBeenCalledWith('changelog', '')
  })
})
