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

describe('Edge cases', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('Should fail if bump is prerelease and suffix is undefined', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'prerelease',
        suffix: '',
        copy_from: 'false'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v1.2.3',
        prefix: 'v',
        tagName: '1.2.3',
        suffix: '',
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
        suffix: '',
        number: {
          major: 2,
          minor: 3,
          patch: 4
        }
      }
    ]
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Prerelease bumps must be used with a suffix'
    )
  })

  it('Should fail if bump is prerelease and copy_from is true', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'prerelease',
        suffix: 'beta',
        copy_from: 'true'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v1.2.3',
        prefix: 'v',
        tagName: '1.2.3',
        suffix: '',
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
        suffix: '',
        number: {
          major: 2,
          minor: 3,
          patch: 4
        }
      }
    ]
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'The flag copy_from:true is not meant to be used with bump:prerelease'
    )
  })

  it('Should pick the latest existing valid version with the provided suffix and replace it with the target_suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'none',
        suffix: 'alpha',
        target_suffix: 'beta',
        copy_from: 'true'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v1.2.3-alpha',
        prefix: 'v',
        tagName: '1.2.3',
        suffix: 'alpha',
        number: {
          major: 1,
          minor: 2,
          patch: 3
        }
      },
      {
        fullTag: 'v2.3.4-alpha',
        prefix: 'v',
        tagName: '2.3.4',
        suffix: 'alpha',
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

  it('Should return v0.0.0 as the latest tag and update its minor version', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'minor',
        suffix: '',
        target_suffix: '',
        copy_from: 'false'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = []
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v0.1.0')
  })

  it('Should return v0.0.0 as the latest tag and update its minor version and add the suffix and prerelease number', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'prerelease',
        suffix: 'beta',
        target_suffix: '',
        copy_from: 'false'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = []
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v0.1.0-beta.1')
  })

  it('Should update the tag without prefix or suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: '',
        bump: 'minor',
        suffix: '',
        target_suffix: '',
        copy_from: 'false'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = [
      {
        fullTag: '1.2.3',
        prefix: '',
        tagName: '1.2.3',
        suffix: '',
        number: {
          major: 1,
          minor: 2,
          patch: 3
        }
      },
      {
        fullTag: '2.3.4',
        prefix: '',
        tagName: '2.3.4',
        suffix: '',
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
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', '2.4.0')
  })
})
