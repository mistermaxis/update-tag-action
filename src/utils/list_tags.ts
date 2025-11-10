import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { VersionTag } from './types.js'
import { stripVersionNumber, tagToNumber } from './utils.js'
import { getPrefix, getSuffix } from './utils.js'

export async function listTags(): Promise<VersionTag[]> {
  const githubToken = core.getInput('github_token')
  const octokit = getOctokit(githubToken)
  const { owner, repo } = context.repo

  const response = await octokit.rest.repos.listTags({
    per_page: 10,
    page: 1,
    owner,
    repo
  })

  const tags: VersionTag[] = response.data.map((tag) => {
    return {
      fullTag: tag.name,
      prefix: getPrefix(),
      tagName: stripVersionNumber(tag.name),
      suffix: getSuffix(),
      prerelease_number: tagToNumber(tag.name).prerelease?.toString(),
      number: tagToNumber(tag.name)
    }
  })
  return tags
}
