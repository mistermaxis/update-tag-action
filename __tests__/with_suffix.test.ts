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

describe('Major bump with suffix', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'major',
        suffix: 'beta',
        replace_suffix: 'false'
      }
      return inputValues[inputName]
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('Should pick the latest existing valid version without a suffix and update its major version component and add the suffix', async () => {
    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v2.4.6',
        prefix: 'v',
        tagName: '2.4.6',
        suffix: 'beta',
        number: {
          major: 2,
          minor: 4,
          patch: 6
        }
      },
      {
        fullTag: 'v1.3.4',
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

  it('Should pick the latest version, with or without a suffix, and update its major version component and add the suffix', async () => {
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

  it('Should create version v0.0.0 and update its major version component and add the suffix', async () => {
    listTags.mockImplementation(() => Promise.resolve([]))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v1.0.0-beta')
  })
})

describe('Minor bump with suffix', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'minor',
        suffix: 'beta',
        replace_suffix: 'false'
      }
      return inputValues[inputName]
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('Should pick the latest existing valid version without a suffix and update its minor version component and add the suffix', async () => {
    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v2.4.6',
        prefix: 'v',
        tagName: '2.4.6',
        suffix: 'beta',
        number: {
          major: 2,
          minor: 4,
          patch: 6
        }
      },
      {
        fullTag: 'v1.3.4',
        prefix: 'v',
        tagName: '1.3.4',
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
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v2.5.0-beta')
  })

  it('Should pick the latest version, with or without a suffix, and update its minor version component and add the suffix', async () => {
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
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v2.4.0-beta')
  })

  it('Should create version v0.0.0 and update its major version component and add the suffix', async () => {
    listTags.mockImplementation(() => Promise.resolve([]))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v0.1.0-beta')
  })
})

describe('Patch bump with suffix', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((inputName: string) => {
      const inputValues: { [key: string]: string } = {
        prefix: 'v',
        bump: 'patch',
        suffix: 'beta',
        replace_suffix: 'false'
      }
      return inputValues[inputName]
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('Should pick the latest existing valid version without a suffix and update its patch version component and add the suffix', async () => {
    const mockVersionTag: VersionTag[] = [
      {
        fullTag: 'v2.4.6',
        prefix: 'v',
        tagName: '2.4.6',
        suffix: 'beta',
        number: {
          major: 2,
          minor: 4,
          patch: 6
        }
      },
      {
        fullTag: 'v2.4.4',
        prefix: 'v',
        tagName: '2.4.4',
        suffix: 'beta',
        number: {
          major: 2,
          minor: 4,
          patch: 4
        }
      }
    ]
    listTags.mockImplementation(() => Promise.resolve(mockVersionTag))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v2.4.7-beta')
  })

  it('Should pick the latest version, with or without a suffix, and update its minor version component and add the suffix', async () => {
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
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v2.3.5-beta')
  })

  it('Should create version v0.0.0 and update its major version component and add the suffix', async () => {
    listTags.mockImplementation(() => Promise.resolve([]))

    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenCalledWith('updated_tag', 'v0.0.1-beta')
  })
})
