import * as core from '@actions/core'
import {
  BumpType,
  VersionList,
  SearchType,
  VersionNumber,
  VersionTag
} from './types.js'

const prefix: string = core.getInput('prefix')
const version_suffix = core.getInput('suffix')

export function sortVersions(versionList: VersionList) {
  versionList.tags.sort((a, b) => {
    if (a.number.major !== b.number.major) {
      return a.number.major - b.number.major
    }
    if (a.number.minor !== b.number.minor) {
      return a.number.minor - b.number.minor
    }
    if (a.number.patch !== b.number.patch) {
      return a.number.patch - b.number.patch
    }
    if (a.number.prerelease && b.number.prerelease) {
      if (a.number.prerelease !== b.number.prerelease) {
        return a.number.prerelease - b.number.prerelease
      }
    }
    return 0 // They are equal
  })
  return versionList
}

export function bumpTypeFromString(bump: string): BumpType {
  switch (bump) {
    case 'prerelease':
      return BumpType.PRERELEASE
    case 'patch':
      return BumpType.PATCH
    case 'minor':
      return BumpType.MINOR
    case 'major':
      return BumpType.MAJOR
    case 'none':
    default:
      return BumpType.NONE
  }
}

export function versionRegex(searchType: SearchType): RegExp {
  const version_number: string = '\\d{1,3}.\\d{1,3}.\\d{1,3}'
  const suffix: string = version_suffix ? `-${version_suffix}` : ''
  const prerelease_number: string = '.[0-9]{1,3}'
  const pattern_prerelease: string = `^${prefix}${version_number}${suffix}${prerelease_number}$`
  const pattern_suffix: string = `^${prefix}\\d{1,3}.\\d{1,3}.\\d{1,3}${suffix}$`
  const pattern_base: string = `^${prefix}\\d{1,3}.\\d{1,3}.\\d{1,3}$`
  const pattern_stripped: string = '\\d{1,3}.\\d{1,3}.\\d{1,3}'
  const flags: string = 'gm'

  switch (searchType) {
    case SearchType.WITH_SUFFIX:
      return new RegExp(pattern_suffix, flags)
    case SearchType.PRERELEASE:
      return new RegExp(pattern_prerelease, flags)
    case SearchType.STRIPPED_NUMBER:
      return new RegExp(pattern_stripped)
    case SearchType.NO_SUFFIX:
    default:
      return new RegExp(pattern_base, flags)
  }
}

export function stripVersionNumber(tag: string): string {
  return tag
    .replace(RegExp(`${prefix}`), '')
    .replace(RegExp(`-${version_suffix}.*`), '')
}

export function tagToNumber(tag: string): VersionNumber {
  const stripped_version: RegExpMatchArray | null = tag.match(
    versionRegex(SearchType.STRIPPED_NUMBER)
  )

  const prerelease_pattern = RegExp(`-${version_suffix}.\\d{1,3}$`)

  const prerelease_match: RegExpMatchArray | null =
    tag.match(prerelease_pattern)

  let prerelease_number: number | undefined = undefined

  if (prerelease_match) {
    const prerelease: string = prerelease_match?.[0].replace(
      `-${version_suffix}.`,
      ''
    )
    prerelease_number = parseInt(prerelease)
  }

  const numbers = stripped_version?.[0].split('.').map(Number)
  const version_numbers = numbers ? numbers : [0, 0, 0]
  const version_number: VersionNumber = {
    major: version_numbers[0],
    minor: version_numbers[1],
    patch: version_numbers[2],
    prerelease: prerelease_number
  }
  return version_number
}

export function tagNameFromNumber(versionNumber: VersionNumber): string {
  return `${versionNumber.major}.${versionNumber.minor}.${versionNumber.patch}`
}

export function fullTagFromObject(tag: VersionTag): string {
  let version_suffix: string
  const copy_from: boolean = core.getInput('copy_from') === 'true'
  const target_suffix: string = core.getInput('target_suffix')

  if (copy_from) {
    version_suffix = target_suffix ? `-${target_suffix}` : ''
  } else {
    version_suffix = tag.suffix ? `-${tag.suffix}` : ''
  }

  const prerelease: string = tag.prerelease_number
    ? `.${tag.prerelease_number}`
    : ''
  return `${tag.prefix ?? ''}${tag.tagName}${version_suffix}${copy_from ? '' : prerelease}`
}
