import { SearchType, VersionList, VersionTag } from './types.js'
import { sortVersions, versionRegex } from './utils.js'

export function searchPrerelease(tagList: VersionList): VersionTag {
  const match_result: VersionList = {
    prefix: tagList.prefix,
    tags: [],
    suffix: tagList.suffix
  }

  match_result.tags = tagList.tags.filter((tag) =>
    tag.fullTag.match(versionRegex(SearchType.PRERELEASE))
  )

  if (match_result.tags.length === 0) {
    match_result.tags = tagList.tags.filter((tag) =>
      tag.fullTag.match(versionRegex(SearchType.WITH_SUFFIX))
    )
  }

  if (match_result.tags.length === 0) {
    match_result.tags = tagList.tags.filter((tag) =>
      tag.fullTag.match(versionRegex(SearchType.NO_SUFFIX))
    )
  }

  const matched_tags: VersionList = match_result.tags
    ? sortVersions(match_result)
    : { prefix: tagList.prefix, tags: [], suffix: tagList.suffix }

  const tag: VersionTag | undefined = matched_tags.tags.pop()

  const latest_tag: VersionTag = {
    fullTag: tag ? tag.fullTag : `${tagList.prefix}0.0.0`,
    prefix: tagList.prefix,
    tagName: tag ? tag.tagName : '0.0.0',
    suffix: tagList.suffix,
    prerelease_number: tag?.prerelease_number,
    number: tag?.number ? tag.number : { major: 0, minor: 0, patch: 0 }
  }
  return latest_tag
}

export function searchBase(tagList: VersionList): VersionTag {
  const match_result: VersionList = {
    prefix: tagList.prefix,
    tags: [],
    suffix: tagList.suffix
  }

  if (tagList.suffix !== '') {
    match_result.tags = tagList.tags.filter((tag) =>
      tag.fullTag.match(versionRegex(SearchType.WITH_SUFFIX))
    )
  }

  if (match_result.tags.length === 0) {
    match_result.tags = tagList.tags.filter((tag) =>
      tag.fullTag.match(versionRegex(SearchType.NO_SUFFIX))
    )
  }

  const matched_tags: VersionList = match_result.tags
    ? sortVersions(match_result)
    : { prefix: tagList.prefix, tags: [], suffix: tagList.suffix }

  const tag: VersionTag | undefined = matched_tags.tags.pop()

  const latest_tag: VersionTag = {
    fullTag: tag ? tag.fullTag : `${tagList.prefix}0.0.0`,
    prefix: tagList.prefix,
    tagName: tag ? tag.tagName : '0.0.0',
    suffix: tagList.suffix,
    number: tag?.number ? tag.number : { major: 0, minor: 0, patch: 0 }
  }

  return latest_tag
}
