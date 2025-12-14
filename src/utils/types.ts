export enum SearchType {
  NO_SUFFIX,
  WITH_SUFFIX,
  PRERELEASE,
  STRIPPED_NUMBER
}

export enum BumpType {
  NONE,
  PATCH,
  MINOR,
  MAJOR,
  PREPATCH,
  PREMINOR,
  PREMAJOR
}

export type VersionTag = {
  fullTag: string
  prefix?: string
  tagName: string
  suffix?: string
  prerelease_number?: string
  number: VersionNumber
}

export type VersionNumber = {
  major: number
  minor: number
  patch: number
  prerelease?: number
}
