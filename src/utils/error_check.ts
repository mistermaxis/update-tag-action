import * as core from '@actions/core'
import { getBump, getCopyFrom, getSuffix } from './utils.js'
import { BumpType } from './types.js'

export function checkForErrors() {
  const bump = getBump()
  const suffix = getSuffix()
  const copy_from = getCopyFrom()

  if (bump === BumpType.PRERELEASE && !suffix) {
    throw core.setFailed('Prerelease bumps must be used with a suffix')
  }

  if (bump === BumpType.PRERELEASE && copy_from === true) {
    throw core.setFailed(
      'The flag copy_from:true is not meant to be used with bump:prerelease'
    )
  }

  if (suffix && copy_from == true) {
    core.warning(
      'If there is no tag with the provided suffix, copy_from is unnecessary'
    )
  }
}
