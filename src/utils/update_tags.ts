import { SearchType, VersionTag } from './types.js'
import { fullTagFromObject, tagNameFromNumber, versionRegex } from './utils.js'

/**
 * Returns the tag after updating its prerelease version component
 * @param {VersionTag} tag - The latest relevant tag found
 * @example updatePrerelease({ fullTag: 'v1.2.3-beta.2' })
 * @returns {VersionTag} { fullTag: 'v1.2.3-beta.3' }
 */
export function updatePrerelease(tag: VersionTag): VersionTag {
  const updated_tag: VersionTag = {
    fullTag: '',
    prefix: tag.prefix,
    tagName: '',
    suffix: tag.suffix,
    number: { major: 0, minor: 0, patch: 0 }
  }

  if (
    versionRegex(SearchType.NO_SUFFIX).test(tag.fullTag) ||
    versionRegex(SearchType.WITH_SUFFIX).test(tag.fullTag)
  ) {
    updated_tag.number = {
      major: tag.number.major,
      minor: tag.number.minor + 1,
      patch: 0,
      prerelease: 1
    }
    updated_tag.prerelease_number = '1'
    updated_tag.tagName = tagNameFromNumber(updated_tag.number)
    updated_tag.fullTag = fullTagFromObject(updated_tag)
  } else {
    updated_tag.number = {
      ...tag.number,
      prerelease: tag.number.prerelease! + 1
    }
    updated_tag.prerelease_number = updated_tag.number.prerelease?.toString()
    updated_tag.tagName = tagNameFromNumber(updated_tag.number)
    updated_tag.fullTag = fullTagFromObject(updated_tag)
  }

  return updated_tag
}

/**
 * Returns the tag after updating its patch version component
 * @param {VersionTag} tag - The latest relevant tag found
 * @example updatePatch({ fullTag: 'v1.2.3' })
 * @returns {VersionTag} { fullTag: 'v1.2.4' }
 */
export function updatePatch(tag: VersionTag): VersionTag {
  const updated_tag: VersionTag = {
    fullTag: '',
    prefix: tag.prefix,
    tagName: '',
    suffix: tag.suffix,
    number: { ...tag.number, patch: tag.number.patch + 1 }
  }

  updated_tag.tagName = tagNameFromNumber(updated_tag.number)
  updated_tag.fullTag = fullTagFromObject(updated_tag)

  return updated_tag
}

/**
 * Returns the tag after updating the minor version component
 * @param {VersionTag} tag - The latest relevant tag found
 * @example updateMinor({ fullTag: 'v1.2.3' })
 * @returns {VersionTag} { fullTag: 'v1.3.0' }
 */
export function updateMinor(tag: VersionTag): VersionTag {
  const updated_tag: VersionTag = {
    fullTag: '',
    prefix: tag.prefix,
    tagName: '',
    suffix: tag.suffix,
    number: { major: tag.number.major, minor: tag.number.minor + 1, patch: 0 }
  }

  updated_tag.tagName = tagNameFromNumber(updated_tag.number)
  updated_tag.fullTag = fullTagFromObject(updated_tag)

  return updated_tag
}

/**
 * Returns the tag after updating the major version component
 * @param {VersionTag} tag - The latest relevant tag found
 * @example updateMajor({ fullTag: 'v1.2.3' })
 * @returns {VersionTag} { fullTag: 'v2.0.0' }
 */
export function updateMajor(tag: VersionTag): VersionTag {
  const updated_tag: VersionTag = {
    fullTag: '',
    prefix: tag.prefix,
    tagName: '',
    suffix: tag.suffix,
    number: { major: tag.number.major + 1, minor: 0, patch: 0 }
  }

  updated_tag.tagName = tagNameFromNumber(updated_tag.number)
  updated_tag.fullTag = fullTagFromObject(updated_tag)

  return updated_tag
}

/**
 * Returns the tag without the prerelease number
 * @param {VersionTag} tag - The latest relevant tag found
 * @example updateNone({ fullTag: 'v1.2.3-beta.1' })
 * @returns {VersionTag} { fullTag: 'v1.2.3-beta' }
 */
export function updateNone(tag: VersionTag): VersionTag {
  const updated_tag: VersionTag = tag

  updated_tag.tagName = tagNameFromNumber(updated_tag.number)
  updated_tag.fullTag = fullTagFromObject(updated_tag)
  return updated_tag
}
