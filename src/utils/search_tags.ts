import { getPrefix, getSuffix } from './utils.js'
import { SearchType, VersionTag } from './types.js'
import { sortVersions, versionRegex } from './utils.js'

/**
 * Returns the latest prerelease tag
 * @param {VersionTag[]} tagList - The list of tags in the repository
 * @example searchPrerelease([{ fullTag: 'v1.2.3' }, { fullTag: 'v2.3.4-beta.3' }])
 * @returns {VersionTag} { fullTag: 'v2.3.4-beta.3' }
 */
export function searchPrerelease(tagList: VersionTag[]): VersionTag {
  let match_list: VersionTag[] = []

  match_list = tagList.filter((tag) =>
    versionRegex(SearchType.PRERELEASE).test(tag.fullTag)
  )

  if (match_list.length === 0) {
    match_list = tagList.filter((tag) =>
      versionRegex(SearchType.WITH_SUFFIX).test(tag.fullTag)
    )
  }

  if (match_list.length === 0) {
    match_list = tagList.filter((tag) =>
      versionRegex(SearchType.NO_SUFFIX).test(tag.fullTag)
    )
  }

  const matched_tags: VersionTag[] = match_list ? sortVersions(match_list) : []

  const tag: VersionTag | undefined = matched_tags.pop()

  const latest_tag: VersionTag = {
    fullTag: tag ? tag.fullTag : `${getPrefix()}0.0.0`,
    prefix: getPrefix(),
    tagName: tag ? tag.tagName : '0.0.0',
    suffix: getSuffix(),
    prerelease_number: tag?.prerelease_number,
    number: tag?.number ? tag.number : { major: 0, minor: 0, patch: 0 }
  }

  return latest_tag
}

/**
 * Returns the latest version without prerelease component and the provided suffix, if any
 * @param {VersionTag[]} tagList - The list of tags in the repository
 * @example searchBase([{ fullTag: 'v1.2.3' }, { fullTag: 'v2.3.4-beta' }])
 * @returns {VersionTag} { fullTag: 'v2.3.4-beta' }
 */
export function searchBase(tagList: VersionTag[]): VersionTag {
  let match_list: VersionTag[] = []

  if (getSuffix() !== '') {
    match_list = tagList.filter((tag) =>
      tag.fullTag.match(versionRegex(SearchType.WITH_SUFFIX))
    )
  }

  if (match_list.length === 0) {
    match_list = tagList.filter((tag) =>
      tag.fullTag.match(versionRegex(SearchType.NO_SUFFIX))
    )
  }

  const matched_tags: VersionTag[] = match_list ? sortVersions(match_list) : []

  const tag: VersionTag | undefined = matched_tags.pop()

  const latest_tag: VersionTag = {
    fullTag: tag ? tag.fullTag : `${getPrefix()}0.0.0`,
    prefix: getPrefix(),
    tagName: tag ? tag.tagName : '0.0.0',
    suffix: getSuffix(),
    number: tag?.number ? tag.number : { major: 0, minor: 0, patch: 0 }
  }

  return latest_tag
}
