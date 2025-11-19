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
import { BumpType, VersionTag } from './utils/types.js'
import { getBump, getCopyFrom } from './utils/utils.js'
import { checkForErrors } from './utils/error_check.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const bump: BumpType = getBump()
    const copy_from: boolean = getCopyFrom()
    const tagList: VersionTag[] = await listTags()

    checkForErrors()

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
        latest_tag = searchPrerelease(tagList)
        updated_tag = copy_from ? updateNone(latest_tag) : latest_tag
        break
    }

    // Set outputs for other workflow steps to use
    core.setOutput('updated_tag', updated_tag.fullTag)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
