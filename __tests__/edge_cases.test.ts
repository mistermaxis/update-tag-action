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

describe('Fail cases', () => {
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
      'Error: A new_suffix must be defined when using replace_suffix: true'
    )
  })

  it('Should fail if bump is a prerelease bump and suffix is undefined', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'preminor'
        // suffix: ''
        // replace_suffix: 'false'
        // new_suffix: 'undefined'
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

  it('Should fail if bump is a prerelease bump and replace_suffix is true', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'premajor',
        suffix: 'beta',
        replace_suffix: 'true'
        // new_suffix: 'undefined'
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = []
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Error: The flag replace_suffix: true is not meant to be used with prerelease bumps'
    )
  })
})

describe('Cases where there is suffix input but the latest version might have no suffix', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('If the latest version has a suffix, use that version to update', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'premajor',
        suffix: 'beta'
        // new_suffix: 'undefined',
        // replace_suffix: 'false'
      }
      return inputValues[inputName]
    })

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
        fullTag: 'v2.3.4-beta',
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

  it('If the latest version has no suffix, use that version to update', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'premajor',
        suffix: 'beta'
        // new_suffix: 'undefined',
        // replace_suffix: 'false'
      }
      return inputValues[inputName]
    })

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
})

describe('Replace the suffix with a new suffix', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('If the new_suffix is an empty string, remove the existing suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'major',
        suffix: 'beta',
        replace_suffix: 'true',
        new_suffix: ''
      }
      return inputValues[inputName]
    })

    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v2.3.4-beta',
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
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v3.0.0')
  })

  it('If the suffix is an empty string, add the new_suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'major',
        suffix: '',
        replace_suffix: 'true',
        new_suffix: 'beta'
      }
      return inputValues[inputName]
    })

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
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v3.0.0-beta')
  })

  it('If neither the suffix or the new_suffix are empty strings, replace the suffix with the new_suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'major',
        suffix: 'alpha',
        replace_suffix: 'true',
        new_suffix: 'beta'
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
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v3.0.0-beta')
  })

  it('If there are no valid tags, return 0.0.0 and add the new_suffix', async () => {
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'none',
        suffix: 'alpha',
        replace_suffix: 'true',
        new_suffix: 'beta'
      }
      return inputValues[inputName]
    })

    listTags.mockImplementation(() => Promise.resolve([]))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v0.0.0-beta')
  })
})
