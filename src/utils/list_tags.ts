import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { VersionTag } from './types.js'
import { stripVersionNumber, tagToNumber } from './utils.js'

export async function listTags(): Promise<VersionTag[]> {
  const githubToken = core.getInput('github_token')
  const octokit = getOctokit(githubToken)
  const prefix = core.getInput('prefix')
  const suffix = core.getInput('suffix')
  const { owner, repo } = context.repo

  const response = await octokit.rest.repos.listTags({
    owner,
    repo
  })

  const tags: VersionTag[] = response.data.map((tag) => {
    return {
      fullTag: tag.name,
      prefix: prefix,
      tagName: stripVersionNumber(tag.name),
      suffix: suffix,
      prerelease_number: tagToNumber(tag.name).prerelease?.toString(),
      number: tagToNumber(tag.name)
    }
  })
  return tags
}
