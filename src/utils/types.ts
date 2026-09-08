export enum SearchType {
  NO_SUFFIX,
  WITH_SUFFIX,
  PRERELEASE,
  STRIPPED_NUMBER,
  VALID_TAG
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

export type PushPayload = {
  before: string
  after: string
  commits?: PushCommit[]
}

export type PushCommit = {
  id: string
  message: string
  url: string
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

export type Commit = {
  id: string
  message: string
}
