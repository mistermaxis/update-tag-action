import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { listTags } from '../__fixtures__/list_tags.js'
import { VersionTag } from '../src/utils/types.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/utils/list_tags.js', () => ({ listTags }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('None bump with existing version and copy_from set to false', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'none',
        suffix: 'beta',
        copy_from: 'false'
      }
      return inputValues[inputName]
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('Should pick the latest existing valid version without a suffix and return it', async () => {
    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v1.2.3',
        prefix: 'v',
        tagName: '1.2.3',
        suffix: 'beta',
        number: {
          major: 1,
          minor: 2,
          patch: 3
        }
      },
      {
        fullTag: 'v2.3.4',
        prefix: 'v',
        tagName: '2.3.4',
        suffix: 'beta',
        number: {
          major: 2,
          minor: 3,
          patch: 4
        }
      }
    ]
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v2.3.4')
  })

  it('Should pick the latest existing valid version with the provided suffix and return it', async () => {
    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v1.2.3-beta',
        prefix: 'v',
        tagName: '1.2.3',
        suffix: 'beta',
        number: {
          major: 1,
          minor: 2,
          patch: 3
        }
      },
      {
        fullTag: 'v2.3.4-beta',
        prefix: 'v',
        tagName: '2.3.4',
        suffix: 'beta',
        number: {
          major: 2,
          minor: 3,
          patch: 4
        }
      }
    ]
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v2.3.4-beta')
  })

  it('Should pick the latest existing version with the provided suffix and prerelease number and return it', async () => {
    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v1.2.3-beta.1',
        prefix: 'v',
        tagName: '1.2.3',
        suffix: 'beta',
        prerelease_number: '1',
        number: {
          major: 1,
          minor: 2,
          patch: 3,
          prerelease: 1
        }
      },
      {
        fullTag: 'v1.2.3-beta.2',
        prefix: 'v',
        tagName: '1.2.3',
        suffix: 'beta',
        prerelease_number: '2',
        number: {
          major: 1,
          minor: 2,
          patch: 3,
          prerelease: 2
        }
      }
    ]
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v1.2.3-beta.2')
  })
})
