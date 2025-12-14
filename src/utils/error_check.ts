import * as core from '@actions/core'
import { getBump, getNewSuffix, getReplaceSuffix, getSuffix } from './utils.js'
import { BumpType } from './types.js'

export function checkForErrors() {
  const bump = getBump()
  const suffix = getSuffix()
  const replace_suffix = getReplaceSuffix()

  if (
    (bump === BumpType.PREMAJOR ||
      bump === BumpType.PREMINOR ||
      bump === BumpType.PREPATCH) &&
    !suffix
  ) {
    throw new Error('Prerelease bumps must be used with a suffix')
  }

  if (
    (bump === BumpType.PREMAJOR ||
      bump === BumpType.PREMINOR ||
      bump === BumpType.PREPATCH) &&
    !suffix
  ) {
    throw new Error(
      'The flag replace_suffix:true is not meant to be used with prerelease bumps'
    )
  }

  if (replace_suffix === true && getNewSuffix() === undefined) {
    throw new Error(
      'A new_suffix must be defined when using replace_suffix:true'
    )
  }

  if (suffix && replace_suffix === true) {
    core.warning(
      'If there is no tag with the provided suffix, replace_suffix is unnecessary'
    )
  }
}
