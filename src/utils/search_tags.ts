import { getSuffix } from './utils.js'
import { SearchType, VersionTag } from './types.js'
import { maxVersion, versionRegex } from './utils.js'

/**
 * Returns the latest prerelease tag
 * @param {VersionTag[]} tagList - The list of tags in the repository
 * @example searchPrerelease([{ fullTag: 'v1.2.3' }, { fullTag: 'v2.3.4-beta.3' }])
 * @returns {VersionTag} { fullTag: 'v2.3.4-beta.3' }
 */
export function searchPrerelease(tagList: VersionTag[]): VersionTag {
  let prerelease_list: VersionTag[] = []
  let with_suffix_list: VersionTag[] = []
  let no_suffix_list: VersionTag[] = []

  prerelease_list = tagList.filter((tag) =>
    versionRegex(SearchType.PRERELEASE).test(tag.fullTag)
  )

  with_suffix_list = tagList.filter((tag) =>
    versionRegex(SearchType.WITH_SUFFIX).test(tag.fullTag)
  )

  no_suffix_list = tagList.filter((tag) =>
    versionRegex(SearchType.NO_SUFFIX).test(tag.fullTag)
  )

  const matched_prerelease: VersionTag = maxVersion(prerelease_list)

  const matched_suffix: VersionTag = maxVersion(with_suffix_list)

  const matched_no_suffix: VersionTag = maxVersion(no_suffix_list)

  return maxVersion([matched_suffix, matched_no_suffix, matched_prerelease])
}

/**
 * Returns the latest version without prerelease component and the provided suffix, if any
 * @param {VersionTag[]} tagList - The list of tags in the repository
 * @example searchBase([{ fullTag: 'v1.2.3' }, { fullTag: 'v2.3.4-beta' }])
 * @returns {VersionTag} { fullTag: 'v2.3.4-beta' }
 */
export function searchBase(tagList: VersionTag[]): VersionTag {
  let suffix_list: VersionTag[] = []
  let no_suffix_list: VersionTag[] = []

  if (getSuffix() !== '') {
    suffix_list = tagList.filter((tag) =>
      tag.fullTag.match(versionRegex(SearchType.WITH_SUFFIX))
    )
  }

  no_suffix_list = tagList.filter((tag) =>
    tag.fullTag.match(versionRegex(SearchType.NO_SUFFIX))
  )

  const matched_suffix: VersionTag = maxVersion(suffix_list)
  const matched_no_suffix: VersionTag = maxVersion(no_suffix_list)

  return maxVersion([matched_suffix, matched_no_suffix])
}
