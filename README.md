# Update Tag Action

## Grab the latest tag in your repository and update it

### An action to update a version tag using semver formatting

[![GitHub Super-Linter](https://github.com/mistermaxis/update-tag-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/mistermaxis/update-tag-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/mistermaxis/update-tag-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/mistermaxis/update-tag-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/mistermaxis/update-tag-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/mistermaxis/update-tag-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

### Inputs

| Name             | Type   | Default       | Required | Description                                                                                                                                   |
| :--------------- | ------ | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `bump`           | String | `none`        | false    | The type of bump. Can be major, minor, patch, prerelease or none. Defaults to `none`, Not required                                            |
| `prefix`         | String | `v`           | false    | Prefix to use before the version number. Defaults to `v`. Not required                                                                        |
| `suffix`         | String | `''`          | false    | suffix to use after the version number. Eg `v1.2.3-'beta'`                                                                                    |
| `replace_suffix` | String | `false`       | false    | Whether the tag should copy the version number and update the suffix. Eg: `v1.2.3-beta -> v1.2.3` To be used in conjunction with `new_suffix` |
| `new_suffix`     | String | `'undefined'` | false    | The target suffix to assign to the tag in place of the source one. Eg `alpha -> beta or beta -> ''`                                           |
| `github_token`   | String | `''`          | true     | The GitHub token secret                                                                                                                       |

### Outputs

> `updated_tag`: The newly composed tag (this action doesn't create the tag
> itself. It just creates the formatted tag string and provides it as an output)

## Example

```yaml
name: update-tag
on: push

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
      - name: Create Release Tag
        id: release_tag
        uses: mistermaxis/update-tag-action@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          bump: minor
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

[Examples Without Suffix](EXAMPLES_NO_SUFFIX.md)

[Examples With Suffix](EXAMPLES_SUFFIX.md)

[Examples With Bump: Premajor, Preminor, Prepatch](EXAMPLES_PRERELEASE.md)

[Examples With Bump: None](EXAMPLES_NONE.md)

[Examples With Edge Cases](EXAMPLES_EDGE_CASES.md)
