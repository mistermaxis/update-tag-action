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

  it('Should fail if replace_suffix is true and new_suffix is undefined', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'minor',
        suffix: 'beta',
        replace_suffix: 'true',
        new_suffix: 'undefined'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = []
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Error: A new_suffix must be defined when using replace_suffix:true'
    )
  })

  it('Should fail if bump is prerelease and suffix is undefined', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'preminor',
        suffix: '',
        replace_suffix: 'false'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = []
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Error: Prerelease bumps must be used with a suffix'
    )
  })

  it('Should fail if bump is prerelease and replace_suffix is true', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'premajor',
        suffix: 'beta',
        replace_suffix: 'true'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = []
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Error: The flag replace_suffix:true is not meant to be used with prerelease bumps'
    )
  })

  it('Should pick the latest existing valid version with the provided suffix and replace it with the new_suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'none',
        suffix: 'alpha',
        new_suffix: 'beta',
        replace_suffix: 'true'
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
        new_suffix: '',
        replace_suffix: 'false'
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
        bump: 'preminor',
        suffix: 'beta',
        new_suffix: '',
        replace_suffix: 'false'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = []
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v0.1.0-beta.1')
  })

  it('Should pick the latest existing valid version with or without the suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'premajor',
        suffix: 'beta',
        new_suffix: '',
        replace_suffix: 'false'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = [
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
      },
      {
        fullTag: 'v1.2.3-beta',
        prefix: 'v',
        tagName: '1.2.3',
        suffix: 'beta',
        prerelease_number: undefined,
        number: {
          major: 1,
          minor: 2,
          patch: 3,
          prerelease: undefined
        }
      },
      {
        fullTag: 'v2.3.4',
        prefix: 'v',
        tagName: '2.3.4',
        suffix: 'beta',
        prerelease_number: undefined,
        number: {
          major: 2,
          minor: 3,
          patch: 4,
          prerelease: undefined
        }
      }
    ]
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v3.0.0-beta.1')
  })

  it('Should update the tag without prefix or suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: '',
        bump: 'minor',
        suffix: '',
        new_suffix: '',
        replace_suffix: 'false'
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
