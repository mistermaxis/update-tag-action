import * as core from '@actions/core'
import { listTags } from './utils/list_tags.js'
import { searchBase, searchPrerelease } from './utils/search_tags.js'
import {
  updatePatch,
  updatePrerelease,
  updateMinor,
  updateMajor,
  updateNone
} from './utils/update_tags.js'
import { bumpTypeFromString } from './utils/utils.js'
import { BumpType, VersionList, VersionTag } from './utils/types.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const bump: BumpType = bumpTypeFromString(core.getInput('bump'))
    const copy_from: boolean = core.getInput('copy_from') === 'true'
    const tagList: VersionList = {
      prefix: core.getInput('prefix'),
      tags: await listTags(),
      suffix: core.getInput('suffix')
    }

    let latest_tag: VersionTag
    let updated_tag: VersionTag

    switch (bump) {
      case BumpType.PRERELEASE:
        latest_tag = searchPrerelease(tagList)
        updated_tag = updatePrerelease(latest_tag)
        break
      case BumpType.PATCH:
        latest_tag = searchBase(tagList)
        updated_tag = updatePatch(latest_tag)
        break
      case BumpType.MINOR:
        latest_tag = searchBase(tagList)
        updated_tag = updateMinor(latest_tag)
        break
      case BumpType.MAJOR:
        latest_tag = searchBase(tagList)
        updated_tag = updateMajor(latest_tag)
        break
      case BumpType.NONE:
      default:
        latest_tag = searchPrerelease(tagList) /**@caution */
        updated_tag = copy_from ? updateNone(latest_tag) : latest_tag
        break
    }

    // Set outputs for other workflow steps to use
    core.setOutput('updated_tag', updated_tag.fullTag)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
