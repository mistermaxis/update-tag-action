import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { Commit, PushPayload, SearchType, VersionTag } from './types.js'
import { stripVersionNumber, tagToNumber, versionRegex } from './utils.js'
import { getPrefix, getSuffix } from './utils.js'

export async function listTags(): Promise<VersionTag[]> {
  const githubToken = core.getInput('github_token')
  const octokit = getOctokit(githubToken)
  const { owner, repo } = context.repo

  const response = await octokit.rest.repos.listTags({
    per_page: 250,
    page: 1,
    owner,
    repo
  })

  const validTags = response.data.filter((tag) => {
    return versionRegex(SearchType.VALID_TAG).test(tag.name)
  })

  const tags: VersionTag[] = validTags.map((tag) => {
    return {
      fullTag: tag.name,
      prefix: getPrefix(),
      tagName: stripVersionNumber(tag.name),
      suffix: getSuffix(),
      prerelease_number: tagToNumber(tag.name).prerelease?.toString(),
      number: tagToNumber(tag.name)
    }
  })
  await listCommits()
  return tags
}

export async function listCommits(): Promise<void> {
  if (context.eventName === 'push') {
    const payload = context.payload as PushPayload
    const commits: string[] | undefined = payload.commits?.map((commit) => {
      return `- ${commit.message} ${commit.id} _by ${commit.author.name}_`
    })

    const commitArray: Commit[] | undefined = payload.commits?.map(
      (commit) => ({
        id: commit.id,
        message: commit.message,
        url: commit.url,
        timestamp: commit.timestamp,
        author: {
          name: commit.author.name
        }
      })
    )

    core.setOutput('commits', commitArray ? JSON.stringify(commitArray) : '')
    core.setOutput('changelog', commits ? commits.join('\n') : '')
  } else if (context.eventName === 'pull_request') {
    const githubToken = core.getInput('github_token')
    const octokit = getOctokit(githubToken)
    const { owner, repo } = context.repo

    const pull_request = context.payload.pull_request!
    const response = await octokit.rest.pulls.listCommits({
      owner,
      repo,
      per_page: 250,
      page: 1,
      pull_number: pull_request?.number
    })

    const changelog: string[] = response.data.map(
      (data) =>
        `- ${data.commit.message} ${data.sha} _by ${data.commit.author?.name ?? 'Unknown'}_`
    )

    const commitArray: Commit[] = response.data.map((data) => ({
      id: data.sha,
      message: data.commit.message,
      url: data.html_url,
      timestamp: data.commit.author?.date ?? '',
      author: {
        name: data.commit.author?.name ?? ''
      }
    }))

    core.setOutput('commits', commitArray ? JSON.stringify(commitArray) : '')
    core.setOutput('changelog', changelog ? changelog.join('\n') : '')
  }
}
