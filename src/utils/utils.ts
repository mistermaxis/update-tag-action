import * as core from '@actions/core'
import { BumpType, SearchType, VersionNumber, VersionTag } from './types.js'

export function maxVersion(versionList: VersionTag[]): VersionTag {
  versionList.sort((a, b) => {
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
  return versionList.at(versionList.length - 1) ?? defaultVersion()
}

export function bumpTypeFromString(bump: string): BumpType {
  switch (bump) {
    case 'prepatch':
      return BumpType.PREPATCH
    case 'preminor':
      return BumpType.PREMINOR
    case 'premajor':
      return BumpType.PREMAJOR
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
  const suffix: string = getSuffix() != undefined ? `-${getSuffix()}` : ''
  const prerelease_number: string = '.[0-9]{1,3}'

  const pattern_prerelease: string = `^${getPrefix()}${version_number}${suffix}${prerelease_number}$`
  const pattern_suffix: string = `^${getPrefix() ?? ''}${version_number}${suffix}$`
  const pattern_base: string = `^${getPrefix() ?? ''}${version_number}$`
  const pattern_stripped: string = `${version_number}`

  switch (searchType) {
    case SearchType.WITH_SUFFIX:
      return new RegExp(pattern_suffix)
    case SearchType.PRERELEASE:
      return new RegExp(pattern_prerelease)
    case SearchType.STRIPPED_NUMBER:
      return new RegExp(pattern_stripped)
    case SearchType.NO_SUFFIX:
    default:
      return new RegExp(pattern_base)
  }
}

export function stripVersionNumber(tag: string): string {
  return tag
    .replace(RegExp(`${getPrefix()}`), '')
    .replace(RegExp(`-${getSuffix()}.*`), '')
}

export function tagToNumber(tag: string): VersionNumber {
  const stripped_version: RegExpMatchArray | null = tag.match(
    versionRegex(SearchType.STRIPPED_NUMBER)
  )

  const prerelease_pattern = RegExp(`-${getSuffix()}.\\d{1,3}$`)

  const prerelease_match: RegExpMatchArray | null =
    tag.match(prerelease_pattern)

  let prerelease_number: number | undefined = undefined

  if (prerelease_match) {
    const prerelease: string = prerelease_match?.[0].replace(
      `-${getSuffix()}.`,
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
  const copy_from: boolean = getReplaceSuffix()
  const target_suffix: string | undefined = getNewSuffix()

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

export function getPrefix(): string {
  return core.getInput('prefix')
}

export function getSuffix(): string {
  return core.getInput('suffix')
}

export function getReplaceSuffix(): boolean {
  return core.getInput('replace_suffix') == 'true' ? true : false
}

export function getBump(): BumpType {
  return bumpTypeFromString(core.getInput('bump'))
}

export function getNewSuffix(): string | undefined {
  const newSuffix: string = core.getInput('new_suffix')
  return newSuffix === 'undefined' ? undefined : newSuffix
}

export function defaultVersion(): VersionTag {
  const version: VersionTag = {
    fullTag: `${getPrefix()}0.0.0-${getSuffix()}`,
    prefix: getPrefix(),
    suffix: getSuffix(),
    tagName: '0.0.0',
    prerelease_number: undefined,
    number: {
      major: 0,
      minor: 0,
      patch: 0,
      prerelease: undefined
    }
  }
  return version
}
