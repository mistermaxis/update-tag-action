import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as github from '../__fixtures__/github.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { listTags } = await import('../src/utils/list_tags.js')

describe('List Tags function', () => {
  it('Should return the list of tags formatted as a VersionTag array', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        github_token: '12',
        prefix: 'v',
        suffix: 'beta'
      }
      return inputValues[inputName]
    })

    github.getOctokit.mockImplementation((token) => {
      return {
        rest: {
          repos: {
            listTags: jest.fn().mockReturnValue({
              data: [
                {
                  name: `v8.9.${token}-beta.3`
                },
                {
                  name: `v3.0.${token}-beta`
                }
              ]
            })
          }
        }
      }
    })

    const tags = await listTags()
    const tag = tags.at(0)
    expect(tags.length).toBe(2)
    expect(tag?.fullTag).toBe('v8.9.12-beta.3')
    expect(tag?.prefix).toBe('v')
    expect(tag?.tagName).toBe('8.9.12')
    expect(tag?.suffix).toBe('beta')
    expect(tag?.number.major).toBe(8)
    expect(tag?.number.minor).toBe(9)
    expect(tag?.number.patch).toBe(12)
    expect(tag?.number.prerelease).toBe(3)
  })
})
